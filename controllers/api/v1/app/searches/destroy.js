const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const destroy = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params

  await connection.model('Search').deleteOne({ _id })
  await connection
    .model('Device')
    .updateMany({ searches: _id }, { $pull: { searches: _id } })

  return successResponse(res, req.t('56'))
})

module.exports = destroy
