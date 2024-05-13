const updatePostService = require('../../../../../services/posts/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params
  const { title, description, entity, location, url } = req.body
  let post = await updatePostService(connection, {
    _id,
    title,
    description,
    entity,
    location,
    url,
    updatedBy: req.currentUser._id.toString(),
  })

  post = await connection
    .model('Post')
    .findOne({ _id: post._id })
    .select({
      title: 1,
      description: 1,
      entity: 1,
      location: 1,
      url: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Post updated successfully', {
    post,
  })
})

module.exports = update
