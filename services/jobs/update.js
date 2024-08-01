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
      jobType,
      workplaceType,
      salary,
      updatedBy,
      subDomainId,
      createdOn,
      salaryCurrencySymbol,
    } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      entity: Joi.string().optional(),
      location: Joi.string().optional(),
      url: Joi.string().optional(),
      jobType: Joi.string().allow('').optional(),
      workplaceType: Joi.string().allow('').optional(),
      salary: Joi.number().optional(),
      salaryCurrencySymbol: Joi.string().allow('').optional(),
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
      jobType,
      workplaceType,
      salary,
      salaryCurrencySymbol,
      updatedBy,
      subDomainId,
      createdOn,
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

    if (jobType !== undefined) {
      job.jobType = jobType
    }

    if (workplaceType !== undefined) {
      job.workplaceType = workplaceType
    }

    if (salary !== undefined) {
      job.salary = salary
    }

    if (salaryCurrencySymbol !== undefined) {
      job.salaryCurrencySymbol = salaryCurrencySymbol
    }

    if (createdOn !== undefined) {
      job.createdOn = createdOn
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
