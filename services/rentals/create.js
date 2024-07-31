const Joi = require('joi')
const queue = require('../../utils/bull')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { logError } = require('../../utils/log')
const { saveFile } = require('../../utils/storage')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
      title,
      description,
      entity,
      location,
      url,
      price,
      summary,
      propertyType,
      thumbnails,
      createdBy,
      subDomain,
      subDomainId,
      scrapingURLId,
      createdOn,
    } = params

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      entity: Joi.string().required(),
      location: Joi.string().required(),
      url: Joi.string().required(),
      price: Joi.number().required(),
      summary: Joi.string().required(),
      propertyType: Joi.string().allow('').optional(),
      thumbnails: Joi.array()
        .items(
          Joi.alternatives().try(
            Joi.object({
              action: Joi.string().required().valid('add'),
              file: Joi.alternatives()
                .try(Joi.string(), Joi.object().unknown())
                .required(),
            }),
            Joi.string().required()
          )
        )
        .min(1)
        .required(),
      createdBy: Joi.string().hex().length(24).optional(),
      subDomain: Joi.string().required(),
      subDomainId: Joi.string().hex().length(24).required(),
      scrapingURLId: Joi.string().hex().length(24).optional(),
      createdOn: Joi.date().optional(),
    })

    const { error } = await joiValidate(schema, {
      title,
      description,
      entity,
      location,
      url,
      price,
      summary,
      propertyType,
      thumbnails,
      createdBy,
      subDomain,
      subDomainId,
      scrapingURLId,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    if (scrapingURLId) {
      const alreadyExists = await dbConnection
        .model('Rental')
        .findOne({ scrapingURLId })
        .lean()
        .exec()

      if (alreadyExists) {
        throw new CustomError('Rental already exists')
      }
    }

    const mThumbnails = []
    for (const thumbnail of thumbnails) {
      const obj = {}

      if (typeof thumbnail === 'string') {
        obj.source = 'remote'
        obj.path = thumbnail
      } else {
        if (typeof thumbnail.file === 'string') {
          obj.source = 'remote'
          obj.path = thumbnail.file
        } else if (typeof thumbnail.file === 'object') {
          obj.source = 'local'
          obj.path = await saveFile(thumbnail.file, 'admin/rentals/thumbnails')
        }
      }
      mThumbnails.push(obj)
    }

    const rental = new (dbConnection.model('Rental'))({
      title,
      description,
      entity,
      location,
      url,
      price,
      summary,
      propertyType,
      thumbnails: mThumbnails,
      createdBy,
      subDomain: subDomainId,
      scrapingURLId,
      createdOn,
    })

    await rental.save()
    await rental.addIndex()

    queue.add(
      'sendRentalAlert',
      {
        subDomain,
        subDomainId,
        rentalId: rental._id,
      },
      { delay: 60000 }
    )

    return rental
  } catch (error) {
    logError(error)
    throw new CustomError(error?.message)
  }
}

module.exports = create
