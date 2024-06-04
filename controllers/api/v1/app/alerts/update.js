const updateAlertService = require('../../../../../services/alerts/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params
  const { viewed } = req.body

  let alert = await updateAlertService(connection, {
    _id,
    viewed,
  })

  alert = await connection
    .model('Alert')
    .findOne({ _id: alert._id })
    .select({
      viewed: 1,
      createdAt: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Alert updated successfully', {
    alert,
  })
})

module.exports = update
