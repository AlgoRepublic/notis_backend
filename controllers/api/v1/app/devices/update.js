const updateDeviceService = require('../../../../../services/devices/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { oldFcmToken, fcmToken, sendNotification, adSeen } = req.body

  let device = await updateDeviceService(connection, {
    oldFcmToken,
    fcmToken,
    sendNotification,
    adSeen,
  })

  device = await connection
    .model('Device')
    .findOne({ _id: device._id })
    .select({
      fcmToken: 1,
      sendNotification: 1,
      showAdsAfter: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('53'), {
    device,
  })
})

module.exports = update
