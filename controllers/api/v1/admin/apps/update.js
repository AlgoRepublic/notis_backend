const updateAppService = require('../../../../../services/apps/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  const {
    title,
    description,
    app_type,
    subDomain,
    country,
    color,
    privacyPolicy,
    termsOfUse,
    copyRightClaim,
  } = req.body

  const { logo } = req.files || {}

  let app = await updateAppService(connection, {
    _id,
    title,
    description,
    app_type,
    subDomain,
    country,
    color,
    privacyPolicy,
    termsOfUse,
    copyRightClaim,
    logo,
  })

  app = await connection
    .model('App')
    .findOne({ _id: app._id })
    .populate({ path: 'subDomain', select: { host: 1 } })
    .populate({ path: 'country', select: { name: 1 } })
    .select({
      title: 1,
      description: 1,
      app_type: 1,
      color: 1,
      subDomain: 1,
      country: 1,
      privacyPolicy: 1,
      termsOfUse: 1,
      copyRightClaim: 1,
      logo: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'App updated successfully', {
    app,
  })
})

module.exports = update
