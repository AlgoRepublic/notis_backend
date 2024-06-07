const { logError, logInfo } = require('../../utils/log')

const elasticsearch = async (connection, subDomainId) => {
  try {
    const index = `jobs-${subDomainId.toString()}`
    for await (const job of connection.model('Job').find({})) {
      await job.index({ index })
      logInfo(`Job with id ${job._id} indexed successfully`)
    }
  } catch (error) {
    logError(error)
  }
}

module.exports = elasticsearch
