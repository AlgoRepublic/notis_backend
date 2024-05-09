const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { name, email, roles, sort, sortAs } = req.query
  const query = {}
  const sortQuery = {}

  if (name) {
    query.name = { $regex: name, $options: 'i' }
  }
  if (email) {
    query.email = { $regex: email, $options: 'i' }
  }
  if (roles) {
    query.roles = roles
  }

  if (
    sort &&
    sortAs &&
    ['asc', 'desc'].includes(sortAs) &&
    ['name', 'email', 'roles'].includes(sort)
  ) {
    sortQuery[sort] = sortAs === 'asc' ? 1 : -1
  } else {
    sortQuery.name = 1
  }

  const users = await connection
    .model('User')
    .find(query)
    .populate({
      path: 'subDomains',
      select: { host: 1 },
    })
    .select({ name: 1, email: 1, roles: 1 })
    .sort(sortQuery)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean()

  const count = await connection.model('User').countDocuments(query)
  const pagyUsers = pagyRes(users, count, page, perPage)

  return successResponse(res, 'User List', { users: pagyUsers })
})

module.exports = list
