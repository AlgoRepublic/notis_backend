const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { domainName, host, fqdn, type, answer, ttl, sort, sortAs } = req.query
  const query = {}
  const sortQuery = {}

  if (domainName) {
    query.domainName = { $regex: domainName, $options: 'i' }
  }

  if (host) {
    query.host = { $regex: host, $options: 'i' }
  }

  if (fqdn) {
    query.fqdn = { $regex: fqdn, $options: 'i' }
  }

  if (type) {
    query.type = { $regex: type, $options: 'i' }
  }

  if (answer) {
    query.answer = { $regex: answer, $options: 'i' }
  }

  if (ttl) {
    query.ttl = ttl
  }

  if (
    sort &&
    sortAs &&
    ['asc', 'desc'].includes(sortAs) &&
    ['domainName', 'host', 'fqdn', 'type', 'answer', 'ttl'].includes(sort)
  ) {
    sortQuery[sort] = sortAs === 'asc' ? 1 : -1
  } else {
    sortQuery._id = -1
  }

  const subDomains = await connection
    .model('SubDomain')
    .find(query)
    .select({ domainName: 1, host: 1, fqdn: 1, type: 1, answer: 1, ttl: 1 })
    .sort(sortQuery)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean()

  const count = await connection.model('SubDomain').countDocuments(query)
  const pagySubDomains = pagyRes(subDomains, count, page, perPage)

  return successResponse(res, 'SubDomain List', { subDomains: pagySubDomains })
})

module.exports = list
