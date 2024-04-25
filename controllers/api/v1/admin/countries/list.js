const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const countries = await connection
    .model('Country')
    .find({})
    .select({ name: 1 })
    .sort({ id: 1 })
    .lean()
    .exec()

  return successResponse(res, 'Country List', { countries })
})

module.exports = list
