const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { translate } = require('../../utils/i18n')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
      locale,
      _id,
      title,
      description,
      entity,
      location,
      url,
      price,
      priceCurrencySymbol,
      summary,
      propertyType,
      thumbnails,
      updatedBy,
      subDomainId,
      createdOn,
    } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      entity: Joi.string().optional(),
      location: Joi.string().optional(),
      url: Joi.string().optional(),
      price: Joi.number().optional(),
      priceCurrencySymbol: Joi.string().allow('').optional(),
      summary: Joi.string().optional(),
      propertyType: Joi.string().allow('').optional(),
      thumbnails: Joi.array()
        .items(
          Joi.alternatives().try(
            Joi.object({
              action: Joi.string().required().valid('add', 'remove', 'update'),
              _id: Joi.when('action', {
                is: Joi.valid('update', 'remove'),
                then: Joi.string().hex().length(24).required(),
                otherwise: Joi.forbidden(),
              }),
              // _id: Joi.string().hex().length(24).optional(),
              file: Joi.alternatives()
                .try(Joi.string().required(), Joi.object().unknown())
                .required(),
              file: Joi.when('action', {
                is: Joi.valid('update', 'remove'),
                then: Joi.alternatives()
                  .try(Joi.string().required(), Joi.object().unknown())
                  .optional(),
                otherwise: Joi.alternatives()
                  .try(Joi.string().required(), Joi.object().unknown())
                  .required(),
              }),
            }),
            Joi.string().required()
          )
        )
        .optional(),
      updatedBy: Joi.string().hex().length(24).optional(),
      subDomainId: Joi.string().hex().length(24).required(),
      createdOn: Joi.date().optional(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      title,
      description,
      entity,
      location,
      url,
      price,
      priceCurrencySymbol,
      summary,
      propertyType,
      thumbnails,
      updatedBy,
      subDomainId,
      createdOn,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const rental = await dbConnection.model('Rental').findOne({ _id }).exec()

    if (!rental) {
      throw new CustomError(translate('67', locale))
    }

    if (title !== undefined) {
      rental.title = title
    }

    if (description !== undefined) {
      rental.description = description
    }

    if (entity !== undefined) {
      rental.entity = entity
    }

    if (location !== undefined) {
      rental.location = location
    }

    if (url !== undefined) {
      rental.url = url
    }

    if (price !== undefined) {
      rental.price = price
    }

    if (priceCurrencySymbol !== undefined) {
      rental.priceCurrencySymbol = priceCurrencySymbol
    }

    if (summary !== undefined) {
      rental.summary = summary
    }

    if (propertyType !== undefined) {
      rental.propertyType = propertyType
    }

    if (createdOn !== undefined) {
      rental.createdOn = createdOn
    }

    if (thumbnails !== undefined) {
      if (thumbnails.length && typeof thumbnails[0] === 'string') {
        rental.thumbnails = []
      }

      for (const thumbnail of thumbnails) {
        if (typeof thumbnail === 'string') {
          const obj = {}
          obj.source = 'remote'
          obj.path = thumbnail
          rental.thumbnails.push({ ...obj })
        } else {
          if (thumbnail.action === 'remove') {
            const index = rental.thumbnails.findIndex(
              (t) => t._id === thumbnail._id
            )

            if (index > -1) {
              const t = rental.thumbnails[index]
              rental.thumbnails.splice(index, 1)
            }
          } else if (thumbnail.action === 'update') {
            const index = rental.thumbnails.findIndex(
              (t) => t._id === thumbnail._id
            )

            if (index > -1) {
              const t = rental.thumbnails[index]

              if (typeof thumbnail.file === 'string') {
                t.source = 'remote'
                t.path = thumbnail.file
              } else if (typeof thumbnail.file === 'object') {
                t.source = 'local'
                t.path = await saveFile(
                  thumbnail.file,
                  'admin/rentals/thumbnails'
                )
              }
            }
          } else {
            const obj = {}
            if (typeof thumbnail.file === 'string') {
              obj.source = 'remote'
              obj.path = thumbnail.file
            } else if (typeof thumbnail.file === 'object') {
              obj.source = 'local'
              obj.path = await saveFile(
                thumbnail.file,
                'admin/rentals/thumbnails'
              )
            }

            rental.thumbnails.push({ ...obj })
          }
        }
      }
    }

    rental.subDomain = subDomainId
    rental.updatedBy = updatedBy

    await rental.save()
    await rental.addIndex()

    return rental
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
