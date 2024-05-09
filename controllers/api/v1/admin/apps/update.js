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
    privacy_policy,
    terms_of_use,
    copy_right_claim,
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
    privacy_policy,
    terms_of_use,
    copy_right_claim,
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
      privacy_policy: 1,
      terms_of_use: 1,
      copy_right_claim: 1,
      logo: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'App updated successfully', {
    app,
  })
})

module.exports = update
