const updateAlertService = require('../../../../../services/alerts/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params
  const { viewed } = req.body

  let alert = await updateAlertService(connection, {
    locale: req.getLocale(),
    _id,
    viewed,
  })

  alert = await connection
    .model('Alert')
    .findOne({ _id: alert._id })
    .select({
      viewed: 1,
      createdAt: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('51'), {
    alert,
  })
})

module.exports = update
