const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const info = aysncMiddleware(async (req, res, next) => {
  return successResponse(res, req.t('52'), {
    info: {
      _id: req.device._id,
      sendNotification: req.device.sendNotification,
      showAdsAfter: req.device.showAdsAfter,
    },
  })
})

module.exports = info
