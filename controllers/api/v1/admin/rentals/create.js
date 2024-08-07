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
    propertyType,
    createdOn,
    thumbnails = [],
  } = req.body

  const { thumbnails: thumbnailFiles = [] } = req.files || {}
  let allThumbnails = mergeObjects(thumbnails, thumbnailFiles)

  let rental = await createRentalService(connection, {
    locale: req.getLocale(),
    title,
    description,
    entity,
    location,
    url,
    price,
    summary,
    propertyType,
    thumbnails: allThumbnails,
    createdBy: req.currentUser._id.toString(),
    subDomain: req.subDomain,
    subDomainId: req.subDomainId.toString(),
    createdOn,
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
      propertyType: 1,
      thumbnails: 1,
      createdOn: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('20'), { rental })
})

module.exports = create
