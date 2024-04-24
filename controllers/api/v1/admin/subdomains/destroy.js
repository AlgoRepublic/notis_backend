const destroySubDomainService = require('../../../../../services/subdomains/destroy')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const destroy = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  await destroySubDomainService(connection, { _id })

  return successResponse(res, 'Subdomain deleted successfully')
})

module.exports = destroy
