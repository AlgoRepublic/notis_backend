const sendJobAlertService = require('../services/jobs/sendAlert')
const { getConnectionBySubdomain } = require('../utils/connection-manager')

module.exports = {
  key: 'sendJobAlert',
  options: {},
  async handle(job, done) {
    try {
      const { subDomain, subDomainId, jobId, searchId } = job.data
      await sendJobAlertService(await getConnectionBySubdomain(subDomain), {
        _id: jobId,
        subDomainId,
        searchId,
      })
      await done(null, 'Job alert sent')
    } catch (error) {
      await done(error, null)
    }
  },
}
