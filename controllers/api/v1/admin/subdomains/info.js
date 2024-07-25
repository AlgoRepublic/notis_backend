const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const show = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const subDomain = await connection
    .model('SubDomain')
    .findOne({ _id: req.subDomainId })
    .populate({
      path: 'app',
      select: {
        title: 1,
        description: 1,
        appType: 1,
        logo: 1,
      },
    })
    .select({
      recordId: 1,
      domainName: 1,
      host: 1,
      fqdn: 1,
      type: 1,
      answer: 1,
      ttl: 1,
      subDomainURL: 1,
      scrapingURLCount: 1,
      status: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('28'), {
    subDomain,
  })
})

module.exports = show
