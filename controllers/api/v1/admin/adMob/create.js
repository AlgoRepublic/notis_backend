const createAdMobService = require('../../../../../services/adMob/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { adType, code, subDomains } = req.body
  let adMob = await createAdMobService(connection, {
    locale: req.getLocale(),
    adType,
    code,
    subDomains,
  })

  adMob = await connection
    .model('AdMob')
    .findOne({ _id: adMob._id })
    .populate({
      path: 'subDomains',
      select: {
        host: 1,
      },
    })
    .select({
      adType: 1,
      code: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('3'), {
    adMob,
  })
})

module.exports = create
