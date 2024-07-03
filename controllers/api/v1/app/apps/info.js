const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const info = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const app = await connection
    .model('App')
    .findOne({ subDomain: req.subDomainId })
    .select({
      title: 1,
      description: 1,
      appType: 1,
      color: 1,
      privacyPolicy: 1,
      termsOfUse: 1,
      copyRightClaim: 1,
      logo: 1,
      adsEnabled: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('9'), {
    app,
  })
})

module.exports = info
