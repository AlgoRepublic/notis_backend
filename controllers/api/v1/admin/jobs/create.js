const createJobService = require('../../../../../services/jobs/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { title, description, entity, location, url } = req.body
  let job = await createJobService(connection, {
    title,
    description,
    entity,
    location,
    url,
    createdBy: req.currentUser._id.toString(),
    subDomain: req.subDomain,
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

  return successResponse(res, req.t('14'), { job })
})

module.exports = create
