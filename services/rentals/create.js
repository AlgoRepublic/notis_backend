const Joi = require('joi')
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
      thumbnails,
      createdBy,
      subDomain,
      subDomainId,
    } = params

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      entity: Joi.string().required(),
      location: Joi.string().required(),
      url: Joi.string().required(),
      price: Joi.string().required(),
      summary: Joi.string().required(),
      thumbnails: Joi.array()
        .items(
          Joi.object({
            action: Joi.string().required().valid('add'),
            file: Joi.alternatives()
              .try(Joi.string(), Joi.object().unknown())
              .required(),
          })
        )
        .required(),
      createdBy: Joi.string().hex().length(24).required(),
      subDomain: Joi.string().required(),
      subDomainId: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
      title,
      description,
      entity,
      location,
      url,
      price,
      summary,
      thumbnails,
      createdBy,
      subDomain,
      subDomainId,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const mThumbnails = []
    for (const thumbnail of thumbnails) {
      const obj = {}

      if (typeof thumbnail.file === 'string') {
        obj.source = 'remote'
        obj.path = thumbnail.file
      } else if (typeof thumbnail.file === 'object') {
        obj.source = 'local'
        obj.path = await saveFile(thumbnail.file, 'admin/rentals/thumbnails')
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
      thumbnails: mThumbnails,
      createdBy,
      subDomain: subDomainId,
    })

    await rental.save()
    await rental.addIndex()

    // queue.add('sendRentalAlert', { subDomain, rentalId: rental._id })

    return rental
  } catch (error) {
    logError(error)
    throw new CustomError(error?.message)
  }
}

module.exports = create
