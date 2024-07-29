const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { translate } = require('../../utils/i18n')

const destroy = async (dbConnection, params) => {
  params = params || {}

  try {
    const { locale, _id } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, { _id })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const job = await dbConnection.model('Job').findOne({ _id }).exec()

    if (!job) {
      throw new CustomError(translate('62', locale))
    }

    await job.removeIndex()
    await dbConnection.model('Alert').deleteMany({ job: job._id })
    await job.deleteOne()

    return true
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = destroy
