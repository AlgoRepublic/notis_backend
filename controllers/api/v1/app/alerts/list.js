const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const query = { device: req.device._id }

  const alerts = await connection
    .model('Alert')
    .find(query)
    .populate({
      path: 'job',
      select: {
        title: 1,
        description: 1,
        entity: 1,
        location: 1,
        url: 1,
        createdAt: 1,
      },
    })
    .populate({
      path: 'rental',
      select: {
        title: 1,
        description: 1,
        entity: 1,
        url: 1,
        location: 1,
        summary: 1,
        price: 1,
        thumbnails: 1,
        createdAt: 1,
      },
    })
    .select({
      viewed: 1,
      createdAt: 1,
    })
    .sort({ _id: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean()
    .exec()

  const count = await connection.model('Alert').countDocuments(query)
  const pagyAlerts = pagyRes(alerts, count, page, perPage)

  return successResponse(res, req.t('17'), { alerts: pagyAlerts })
})

module.exports = list
