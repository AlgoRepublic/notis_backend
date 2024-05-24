const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { title, location } = req.query
  const query = {}
  const sortQuery = {}

  if (title || location) {
    query.$or = []
  }

  if (title) {
    query.$or.push({ title: { $regex: new RegExp(title, 'i') } })
    query.$or.push({ description: { $regex: new RegExp(title, 'i') } })
    query.$or.push({ entity: { $regex: new RegExp(title, 'i') } })
  }

  if (location) {
    query.$or.push({ location: { $regex: new RegExp(location, 'i') } })
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
      createdAt: 1,
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
