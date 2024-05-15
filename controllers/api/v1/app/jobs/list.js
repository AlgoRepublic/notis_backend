const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { search } = req.query
  const query = {}
  const sortQuery = {}

  if (search) {
    query.$or = [
      { title: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
      { entity: { $regex: new RegExp(search, 'i') } },
      { location: { $regex: new RegExp(search, 'i') } },
    ]
  }

  sortQuery._id = -1

  const jobs = await connection
    .model('Job')
    .find(query)
    .select({
      title: 1,
      description: 1,
      entity: 1,
      location: 1,
      url: 1,
    })
    .sort(sortQuery)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean()

  const count = await connection.model('Job').countDocuments(query)
  const pagyJobs = pagyRes(jobs, count, page, perPage)

  return successResponse(res, 'Job List', { jobs: pagyJobs })
})

module.exports = list
