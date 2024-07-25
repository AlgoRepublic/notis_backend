const createSubDomainService = require('../../../../../services/subdomains/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { host, status } = req.body
  const subDomain = await createSubDomainService(connection, { host, status })

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
      subDomainURL: subDomain.subDomainURL,
      scrapingURLCount: subDomain.scrapingURLCount,
      status: subDomain.status,
    },
  })
})

module.exports = create
