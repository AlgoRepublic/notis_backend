const Joi = require('joi')
const queue = require('../../utils/bull')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { logError } = require('../../utils/log')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
      title,
      description,
      entity,
      location,
      url,
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
      createdBy,
      subDomain,
      subDomainId,
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
      subDomain: subDomainId,
    })

    await job.save()
    await job.addIndex()

    queue.add(
      'sendJobAlert',
      {
        subDomain,
        subDomainId,
        jobId: job._id,
      },
      { delay: 60000 }
    )

    return job
  } catch (error) {
    logError(error)
    throw new CustomError(error?.message)
  }
}

module.exports = create
