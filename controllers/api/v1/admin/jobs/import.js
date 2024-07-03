const importJobsService = require('../../../../../services/jobs/import')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const importJobs = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { file } = req.files || {}

  await importJobsService(connection, {
    file,
    createdBy: req.currentUser._id.toString(),
    subDomain: req.subDomain,
    subDomainId: req.subDomainId.toString(),
  })

  return successResponse(res, req.t('16'))
})

module.exports = importJobs
