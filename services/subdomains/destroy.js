const Joi = require('joi')
const destroySubDomainService = require('../name.com/dns/destroy')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { logError } = require('../../utils/log')

const destroy = async (dbConnection, params) => {
  params = params || {}

  try {
    const { _id } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, { _id })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const subDomain = await dbConnection
      .model('SubDomain')
      .findOne({ _id })
      .exec()

    if (!subDomain) {
      throw new CustomError('SubDomain not found')
    }

    try {
      await destroySubDomainService({ recordId: subDomain.recordId })
    } catch (error) {
      logError(error?.message)
    }

    await subDomain.deleteOne()

    return true
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = destroy
