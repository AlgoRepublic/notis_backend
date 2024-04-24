const Joi = require('joi')
const { CustomError } = require('../../../../../utils/error')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const show = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

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

  const subDomain = await connection
    .model('SubDomain')
    .findOne({
      _id,
    })
    .select({ domainName: 1, host: 1, fqdn: 1, type: 1, answer: 1, ttl: 1 })
    .lean()
    .exec()

  return successResponse(res, 'SubDomain info', {
    subDomain,
  })
})

module.exports = show
