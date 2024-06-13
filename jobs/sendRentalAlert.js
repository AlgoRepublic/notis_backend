const sendRentalAlertService = require('../services/rentals/sendAlert')
const { getConnectionBySubdomain } = require('../utils/connection-manager')

module.exports = {
  key: 'sendRentalAlert',
  options: {},
  async handle(rental, done) {
    try {
      const { subDomain, subDomainId, rentalId } = rental.data
      await sendRentalAlertService(await getConnectionBySubdomain(subDomain), {
        _id: rentalId,
        subDomainId,
      })
      await done(null, 'Rental alert sent')
    } catch (error) {
      await done(error, null)
    }
  },
}
