const updateAppService = require('../../../../../services/apps/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
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
    enAIText,
    esAIText,
    enFeedbackPopUpText,
    enFeedbackPopUpDescText,
    esFeedbackPopUpText,
    esFeedbackPopUpDescText,
  } = req.body

  const { logo } = req.files || {}

  let app = await updateAppService(connection, {
    locale: req.getLocale(),
    _id,
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
    enAIText,
    esAIText,
    enFeedbackPopUpText,
    enFeedbackPopUpDescText,
    esFeedbackPopUpText,
    esFeedbackPopUpDescText,
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
      enAIText: 1,
      esAIText: 1,
      enFeedbackPopUpText: 1,
      enFeedbackPopUpDescText: 1,
      esFeedbackPopUpText: 1,
      esFeedbackPopUpDescText: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('10'), {
    app,
  })
})

module.exports = update
