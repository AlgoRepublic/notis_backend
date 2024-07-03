const createSubDomainService = require('../../../../../services/subdomains/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { host } = req.body
  const subDomain = await createSubDomainService(connection, { host })

  return successResponse(res, req.t('26'), {
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

module.exports = create
