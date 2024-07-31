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
      jobType,
      workplaceType,
      salary,
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
      jobType: Joi.string().allow('').optional(),
      workplaceType: Joi.string().allow('').optional(),
      salary: Joi.number().optional(),
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
      jobType,
      workplaceType,
      salary,
      createdBy,
      subDomain,
      subDomainId,
      scrapingURLId,
      createdOn,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    if (scrapingURLId) {
      const alreadyExists = await dbConnection
        .model('Job')
        .findOne({ scrapingURLId })
        .lean()
        .exec()

      if (alreadyExists) {
        throw new CustomError('Job already exists')
      }
    }

    const job = new (dbConnection.model('Job'))({
      title,
      description,
      entity,
      location,
      url,
      jobType,
      workplaceType,
      salary,
      createdBy,
      subDomain: subDomainId,
      scrapingURLId,
      createdOn,
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
