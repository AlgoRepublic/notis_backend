const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const clear = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  await connection.model('Search').deleteMany({ device: req.device._id })
  await connection
    .model('Device')
    .updateOne({ _id: req.device._id }, { $set: { searches: [] } })

  return successResponse(res, 'Search cleared successfully')
})

module.exports = clear
