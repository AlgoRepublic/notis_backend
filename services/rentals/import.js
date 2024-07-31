const Joi = require('joi')
const queue = require('../../utils/bull')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { logError } = require('../../utils/log')
const { translate } = require('../../utils/i18n')

const importRentals = async (dbConnection, params) => {
  params = params || {}

  try {
    const { locale, file, createdBy, subDomain, subDomainId } = params

    if (file === undefined) {
      throw new CustomError(translate('68', locale))
    }

    if (file?.mimetype !== 'application/json') {
      throw new CustomError(translate('69', locale))
    }

    const records = JSON.parse(Buffer.from(file.data).toString())

    for (const record in records) {
      try {
        const {
          title,
          description,
          entity,
          location = 'N/A',
          url,
          price,
          summary,
          thumbnails,
        } = records[record]

        const schema = Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          entity: Joi.string().optional(),
          location: Joi.string().required(),
          url: Joi.string().required(),
          price: Joi.number().required(),
          summary: Joi.string().required(),
          thumbnails: Joi.array()
            .items(Joi.string().required())
            .min(1)
            .required(),
          createdBy: Joi.string().hex().length(24).required(),
          subDomain: Joi.string().required(),
          subDomainId: Joi.string().hex().length(24).required(),
        })

        const { error } = await joiValidate(schema, {
          title,
          description,
          entity: entity || 'N/A',
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
          mThumbnails.push({
            source: 'remote',
            path: thumbnail,
          })
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

        queue.add(
          'sendRentalAlert',
          {
            subDomain,
            subDomainId,
            rentalId: rental._id,
          },
          { delay: 60000 }
        )
      } catch (error) {
        logError(error)
      }
    }

    return true
  } catch (error) {
    logError(error)
    throw new CustomError(error?.message)
  }
}

module.exports = importRentals
