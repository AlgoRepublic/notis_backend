const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { type, title, description, entity, location, url, sort, sortAs } =
    req.query
  const query = {}
  const sortQuery = {}

  if (type) {
    query.type = type
  }

  if (title) {
    query.title = { $regex: new RegExp(title, 'i') }
  }

  if (description) {
    query.description = { $regex: new RegExp(description, 'i') }
  }

  if (entity) {
    query.entity = { $regex: new RegExp(entity, 'i') }
  }

  if (location) {
    query.location = { $regex: new RegExp(location, 'i') }
  }

  if (url) {
    query.url = { $regex: new RegExp(url, 'i') }
  }

  if (
    sort &&
    sortAs &&
    ['asc', 'desc'].includes(sortAs) &&
    ['type', 'title', 'description', 'entity', 'location', 'url'].includes(sort)
  ) {
    sortQuery[sort] = sortAs === 'asc' ? 1 : -1
  } else {
    sortQuery._id = -1
  }

  const posts = await connection
    .model('Post')
    .find(query)
    .select({
      type: 1,
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

  const count = await connection.model('Post').countDocuments(query)
  const pagyPosts = pagyRes(posts, count, page, perPage)

  return successResponse(res, 'Post List', { posts: pagyPosts })
})

module.exports = list
