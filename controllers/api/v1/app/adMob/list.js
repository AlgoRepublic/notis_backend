const { aysncMiddleware } = require('../../../../../middlewares/async')
const { successResponse } = require('../../../../../utils/response')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection
  const { adType } = req.query
  const query = {}

  if (adType) {
    query.adType = { $regex: adType, $options: 'i' }
  }
  const adMob = await connection
    .model('AdMob')
    .find(query)
    .select({
      adType: 1,
      code: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'AdMob info', {
    adMob,
  })
})

module.exports = list
