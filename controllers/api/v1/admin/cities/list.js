const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { country_id } = req.query
  const query = {}

  if (country_id) {
    query.country = country_id
  }

  const cities = await connection
    .model('City')
    .find(query)
    .select({ name: 1 })
    .sort({ id: 1 })
    .lean()
    .exec()

  return successResponse(res, req.t('11'), { cities })
})

module.exports = list
