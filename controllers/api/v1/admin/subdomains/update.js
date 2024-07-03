const updateSubDomainService = require('../../../../../services/subdomains/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  const { host } = req.body
  let subDomain = await updateSubDomainService(connection, { _id, host })

  subDomain = await connection
    .model('SubDomain')
    .findOne({ _id: subDomain._id })
    .populate({ path: 'app', select: { title: 1, description: 1 } })
    .select({
      recordId: 1,
      domainName: 1,
      host: 1,
      fqdn: 1,
      type: 1,
      answer: 1,
      ttl: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('30'), {
    subDomain,
  })
})

module.exports = update
