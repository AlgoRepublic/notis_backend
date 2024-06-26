const Joi = require('joi')
const updateSubDomainService = require('../name.com/dns/update')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const { _id, host } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      host: Joi.string().not('www', 'admin').required(),
    })

    const { error } = await joiValidate(schema, { _id, host })

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

    const subDomainExists = await dbConnection
      .model('SubDomain')
      .findOne({ _id: { $ne: subDomain._id }, host: host.toLowerCase() })
      .exec()

    if (subDomainExists) {
      throw new CustomError('SubDomain already exists')
    }

    try {
      const response = await updateSubDomainService({
        recordId: subDomain.recordId,
        host,
      })

      subDomain.host = response.host
      subDomain.recordId = response.id
      subDomain.domainName = response.domainName
      subDomain.fqdn = response.fqdn
      subDomain.host = response.host
      subDomain.answer = response.answer
      subDomain.ttl = response.ttl
      subDomain.type = response.type
      await subDomain.save()

      return subDomain
    } catch (error) {
      throw new CustomError(error?.message)
    }
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
