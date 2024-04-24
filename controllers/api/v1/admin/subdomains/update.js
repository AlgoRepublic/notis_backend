const updateSubDomainService = require('../../../../../services/subdomains/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  const { host } = req.body
  const subDomain = await updateSubDomainService(connection, { _id, host })

  return successResponse(res, 'Subdomain update successfully', {
    subDomain: {
      _id: subDomain._id,
      recordId: subDomain.recordId,
      domainName: subDomain.domainName,
      host: subDomain.host,
      fqdn: subDomain.fqdn,
      type: subDomain.type,
      answer: subDomain.answer,
      ttl: subDomain.ttl,
    },
  })
})

module.exports = update
