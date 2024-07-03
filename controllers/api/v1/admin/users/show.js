const Joi = require('joi')
const { CustomError } = require('../../../../../utils/error')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
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

  const user = await connection
    .model('User')
    .findOne({
      _id,
    })
    .populate({
      path: 'subDomains',
      select: {
        host: 1,
      },
    })
    .select({
      name: 1,
      email: 1,
      roles: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('34'), {
    user,
  })
})

module.exports = update
