const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const query = { device: req.device._id }

  const searches = await connection
    .model('Search')
    .find(query)
    .select({ title: 1, location: 1 })
    .sort({ _id: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean()

  const count = await connection.model('Search').countDocuments(query)
  const pagySearches = pagyRes(searches, count, page, perPage)

  return successResponse(res, 'Search List', { searches: pagySearches })
})

module.exports = list
