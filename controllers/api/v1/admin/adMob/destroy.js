const destroyJobService = require('../../../../../services/adMob/destroy')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const destroy = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  await destroyJobService(connection, { _id })

  return successResponse(res, 'AdMob deleted successfully')
})

module.exports = destroy
