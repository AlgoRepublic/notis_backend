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
      updatedBy,
      subDomainId,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const job = await dbConnection.model('Job').findOne({ _id }).exec()

    if (!job) {
      throw new CustomError(translate('62', locale))
    }

    if (title !== undefined) {
      job.title = title
    }

    if (description !== undefined) {
      job.description = description
    }

    if (entity !== undefined) {
      job.entity = entity
    }

    if (location !== undefined) {
      job.location = location
    }

    if (url !== undefined) {
      job.url = url
    }

    job.subDomain = subDomainId
    job.updatedBy = updatedBy

    await job.save()
    await job.addIndex()

    return job
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
