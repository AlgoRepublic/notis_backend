const updateRentalService = require('../../../../../services/rentals/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { mergeObjects } = require('../../../../../utils/helpers')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params
  const {
    title,
    description,
    entity,
    location,
    url,
    price,
    summary,
    thumbnails = [],
  } = req.body

  const { thumbnails: thumbnailFiles = [] } = req.files || {}
  let allThumbnails = mergeObjects(thumbnails, thumbnailFiles)

  let rental = await updateRentalService(connection, {
    _id,
    title,
    description,
    entity,
    location,
    url,
    price,
    summary,
    thumbnails: allThumbnails,
    updatedBy: req.currentUser._id.toString(),
    subDomainId: req.subDomainId.toString(),
  })

  rental = await connection
    .model('Rental')
    .findOne({ _id: rental._id })
    .select({
      title: 1,
      description: 1,
      entity: 1,
      url: 1,
      summary: 1,
      price: 1,
      thumbnails: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Rental updated successfully', {
    rental,
  })
})

module.exports = update
