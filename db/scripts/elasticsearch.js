const { logError, logInfo } = require('../../utils/log')

const elasticsearch = async (connection, subDomainId) => {
  try {
    const jobsIndex = `jobs-${subDomainId.toString()}`
    for await (const job of connection.model('Job').find({})) {
      await job.index({ index: jobsIndex })
      logInfo(`Job with id ${job._id} indexed successfully`)
    }
    const rentalsIndex = `rentals-${subDomainId.toString()}`
    for await (const rental of connection.model('Rental').find({})) {
      await rental.index({ index: rentalsIndex })
      logInfo(`Rental with id ${rental._id} indexed successfully`)
    }
  } catch (error) {
    logError(error)
  }
}

module.exports = elasticsearch
