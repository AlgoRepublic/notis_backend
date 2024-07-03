const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const clear = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  await connection.model('Alert').deleteMany({ device: req.device._id })

  return successResponse(res, req.t('50'))
})

module.exports = clear
