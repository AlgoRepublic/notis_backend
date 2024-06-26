const importRentalsService = require('../../../../../services/rentals/import')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const importRentals = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { file } = req.files || {}

  await importRentalsService(connection, {
    file,
    createdBy: req.currentUser._id.toString(),
    subDomain: req.subDomain,
    subDomainId: req.subDomainId.toString(),
  })

  return successResponse(res, 'Rentals imported successfully')
})

module.exports = importRentals
