const Joi = require('joi')
const queue = require('../../utils/bull')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const { title, description, entity, location, url, createdBy, subDomain } =
      params

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      entity: Joi.string().required(),
      location: Joi.string().required(),
      url: Joi.string().required(),
      createdBy: Joi.string().hex().length(24).required(),
      subDomain: Joi.string().required(),
    })

    const { error } = await joiValidate(schema, {
      title,
      description,
      entity,
      location,
      url,
      createdBy,
      subDomain,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const job = new (dbConnection.model('Job'))({
      title,
      description,
      entity,
      location,
      url,
      createdBy,
    })

    await job.save()

    queue.add('sendJobAlert', { subDomain, jobId: job._id })

    return job
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
