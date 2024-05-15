const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const { _id, title, description, entity, location, url, updatedBy } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      entity: Joi.string().optional(),
      location: Joi.string().optional(),
      url: Joi.string().optional(),
      updatedBy: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      title,
      description,
      entity,
      location,
      url,
      updatedBy,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const job = await dbConnection.model('Job').findOne({ _id }).exec()

    if (!job) {
      throw new CustomError('Job not found')
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

    job.updatedBy = updatedBy

    await job.save()

    return job
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
