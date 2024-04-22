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
    .lean()
    .exec()

  return successResponse(res, 'User info', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  })
})

module.exports = update