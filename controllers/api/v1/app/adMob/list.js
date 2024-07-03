const { aysncMiddleware } = require('../../../../../middlewares/async')
const { successResponse } = require('../../../../../utils/response')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { adType, sort, sortAs } = req.query
  const query = {}
  const sortQuery = {}

  if (adType) {
    query.adType = adType
  }
  if (
    sort &&
    sortAs &&
    ['asc', 'desc'].includes(sortAs) &&
    ['_id', 'adType'].includes(sort)
  ) {
    sortQuery[sort] = sortAs === 'asc' ? 1 : -1
  } else {
    sortQuery._id = -1
  }
  const adMob = await connection
    .model('AdMob')
    .find(query)
    .select({
      adType: 1,
      code: 1,
    })
    .sort(sortQuery)
    .lean()
    .exec()

  return successResponse(res, req.t('6'), {
    adMob,
  })
})

module.exports = list
