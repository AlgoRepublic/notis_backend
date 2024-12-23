const createSearchService = require('../../../../../services/searches/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { title, location } = req.body

  let search = await createSearchService(connection, {
    locale: req.getLocale(),
    title,
    location,
    device: req.device?._id?.toString(),
    subDomain: req.subDomain,
    subDomainId: req.subDomainId.toString(),
  })

  search = await connection
    .model('Search')
    .findById(search._id)
    .select({
      title: 1,
      location: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('55'), {
    search,
  })
})

module.exports = create
