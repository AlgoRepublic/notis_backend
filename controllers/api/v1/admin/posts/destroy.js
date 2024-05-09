const destroyPostService = require('../../../../../services/posts/destroy')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const destroy = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params
  await destroyPostService(connection, { _id })

  return successResponse(res, 'Post deleted successfully')
})

module.exports = destroy
