const Joi = require('joi')
const { CustomError } = require('../../../../../utils/error')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const show = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection

  const { _id } = req.params

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
  })

  const { error } = await joiValidate(schema, {
    _id,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const rental = await connection
    .model('Rentail')
    .findOne({ _id })
    .select({
      title: 1,
      description: 1,
      entity: 1,
      url: 1,
      summary: 1,
      price: 1,
      thumbnails: 1,
    })
    .lean()
    .exec()

  return successResponse(res, 'Rentail info', {
    rental,
  })
})

module.exports = show
