const updateAdMobService = require('../../../../../services/adMob/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  const { adType, code } = req.body
  let adMob = await updateAdMobService(connection, {
    _id,
    adType,
    code,
  })

  adMob = await connection
    .model('AdMob')
    .findOne({ _id: adMob._id })
    .select({
      adType: 1,
      code: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('7'), {
    adMob: {
      _id: adMob._id,
      adType: adMob.adType,
      code: adMob.code,
    },
  })
})

module.exports = update
