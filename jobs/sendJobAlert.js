const sendJobAlertService = require('../services/jobs/sendAlert')
const { getConnectionBySubdomain } = require('../utils/connection-manager')

module.exports = {
  key: 'sendJobAlert',
  options: {},
  async handle(job, done) {
    try {
      const { subDomain, jobId } = job.data
      await sendJobAlertService(await getConnectionBySubdomain(subDomain), {
        _id: jobId,
      })
      await done(null, 'Job alert sent')
    } catch (error) {
      await done(error, null)
    }
  },
}
