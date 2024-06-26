const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
      _id,
      title,
      description,
      entity,
      location,
      url,
      price,
      summary,
      thumbnails,
      updatedBy,
      subDomainId,
    } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      entity: Joi.string().optional(),
      location: Joi.string().optional(),
      url: Joi.string().optional(),
      price: Joi.string().optional(),
      summary: Joi.string().optional(),
      thumbnails: Joi.array()
        .items(
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
          })
        )
        .optional(),
      updatedBy: Joi.string().hex().length(24).required(),
      subDomainId: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      title,
      description,
      entity,
      location,
      url,
      price,
      summary,
      thumbnails,
      updatedBy,
      subDomainId,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const rental = await dbConnection.model('Rental').findOne({ _id }).exec()

    if (!rental) {
      throw new CustomError('Rental not found')
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

    if (summary !== undefined) {
      rental.summary = summary
    }

    if (thumbnails !== undefined) {
      for (const thumbnail of thumbnails) {
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
