const createRentalService = require('../../../../../services/rentals/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { mergeObjects } = require('../../../../../utils/helpers')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

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

  let rental = await createRentalService(connection, {
    title,
    description,
    entity,
    location,
    url,
    price,
    summary,
    thumbnails: allThumbnails,
    createdBy: req.currentUser._id.toString(),
    subDomain: req.subDomain,
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

  return successResponse(res, 'Rental created successfully', { rental })
})

module.exports = create
