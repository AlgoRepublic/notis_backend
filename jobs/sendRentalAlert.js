const sendRentalAlertService = require('../services/rentals/sendAlert')
const { getConnectionBySubdomain } = require('../utils/connection-manager')

module.exports = {
  key: 'sendRentalAlert',
  options: {},
  async handle(rental, done) {
    try {
      const { subDomain, subDomainId, rentalId, searchId } = rental.data
      await sendRentalAlertService(await getConnectionBySubdomain(subDomain), {
        _id: rentalId,
        subDomainId,
        searchId,
      })
      await done(null, 'Rental alert sent')
    } catch (error) {
      await done(error, null)
    }
  },
}
