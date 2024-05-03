const createAppService = require('../../../../../services/apps/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

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

  let app = await createAppService(connection, {
    title,
    description,
    app_type,
    subDomain,
    country,
    color,
    privacy_policy,
    terms_of_use,
    copy_right_claim,
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
    })
    .lean()
    .exec()

  return successResponse(res, 'App created successfully', {
    app,
  })
})

module.exports = create
