const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { adType, code, sort, sortAs } = req.query
  const query = {}
  const sortQuery = {}

  if (adType) {
    query.adType = adType
  }
  if (code) {
    query.code = { $regex: code, $options: 'i' }
  }
  if (
    sort &&
    sortAs &&
    ['asc', 'desc'].includes(sortAs) &&
    ['code', 'adType'].includes(sort)
  ) {
    sortQuery[sort] = sortAs === 'asc' ? 1 : -1
  } else {
    sortQuery.code = 1
  }

  const adMob = await connection
    .model('AdMob')
    .find(query)
    .select({ code: 1, adType: 1 })
    .sort(sortQuery)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean()

  const count = await connection.model('AdMob').countDocuments(query)
  const pagyAdMobs = pagyRes(adMob, count, page, perPage)

  return successResponse(res, 'AdMob List', { AdMobs: pagyAdMobs })
})

module.exports = list
