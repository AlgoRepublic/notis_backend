const createPostService = require('../../../../../services/posts/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { type, title, description, entity, location, url } = req.body
  let post = await createPostService(connection, {
    type,
    title,
    description,
    entity,
    location,
    url,
    createdBy: req.currentUser._id.toString(),
  })

  post = await connection
    .model('Post')
    .findOne({ _id: post._id })
    .select({
      type: 1,
      title: 1,
      description: 1,
      entity: 1,
      location: 1,
      url: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Post created successfully', { post })
})

module.exports = create
