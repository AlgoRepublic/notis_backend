const updateJobService = require('../../../../../services/jobs/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params
  const { title, description, entity, location, url } = req.body
  let job = await updateJobService(connection, {
    _id,
    title,
    description,
    entity,
    location,
    url,
    updatedBy: req.currentUser._id.toString(),
    subDomainId: req.subDomainId.toString(),
  })

  job = await connection
    .model('Job')
    .findOne({ _id: job._id })
    .select({
      title: 1,
      description: 1,
      entity: 1,
      location: 1,
      url: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Job updated successfully', {
    job,
  })
})

module.exports = update
