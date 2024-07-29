const createAppService = require('../../../../../services/apps/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const {
    title,
    description,
    appType,
    subDomain,
    country,
    color,
    privacyPolicy,
    termsOfUse,
    copyRightClaim,
    adsEnabled,
  } = req.body

  const { logo } = req.files || {}

  let app = await createAppService(connection, {
    locale: req.getLocale(),
    title,
    description,
    appType,
    subDomain,
    country,
    color,
    privacyPolicy,
    termsOfUse,
    copyRightClaim,
    logo,
    adsEnabled,
  })

  app = await connection
    .model('App')
    .findOne({ _id: app._id })
    .populate({ path: 'subDomain', select: { host: 1 } })
    .populate({ path: 'country', select: { name: 1 } })
    .select({
      title: 1,
      description: 1,
      appType: 1,
      color: 1,
      subDomain: 1,
      country: 1,
      privacyPolicy: 1,
      termsOfUse: 1,
      copyRightClaim: 1,
      logo: 1,
      adsEnabled: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('8'), {
    app,
  })
})

module.exports = create
