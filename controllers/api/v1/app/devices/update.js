const updateDeviceService = require('../../../../../services/devices/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { oldFcmToken, fcmToken, sendNotification } = req.body

  let device = await updateDeviceService(connection, {
    oldFcmToken,
    fcmToken,
    sendNotification,
  })

  device = await connection
    .model('Device')
    .findOne({ _id: device._id })
    .select({
      fcmToken: 1,
      sendNotification: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Device updated successfully', {
    device,
  })
})

module.exports = update
