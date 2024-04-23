const Joi = require('joi')
const createSubDomainService = require('../../services/name.com/dns/create')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const { host } = params

    const schema = Joi.object({
      host: Joi.string().required(),
    })

    const { error } = await joiValidate(schema, { host })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const subDomainExists = await dbConnection
      .model('SubDomain')
      .findOne({ host: host.toLowerCase() })
      .lean()
      .exec()

    if (subDomainExists) {
      throw new CustomError('SubDomain already exists')
    }

    try {
      const response = await createSubDomainService({ host })
      const subDomain = new (dbConnection.model('SubDomain'))({
        recordId: response.id,
        domainName: response.domainName,
        fqdn: response.fqdn,
        host: response.host,
        answer: response.answer,
        ttl: response.ttl,
        type: response.type,
      })

      await subDomain.save()
      return subDomain
    } catch (error) {
      throw new CustomError(error?.message)
    }
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
