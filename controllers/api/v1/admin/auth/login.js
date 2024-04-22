const Joi = require('joi')
const bcrypt = require('bcrypt')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { CustomError } = require('../../../../../utils/error')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const login = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection
  const { email, password } = req.body

  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })

  const { error } = await joiValidate(schema, {
    email,
    password,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  let user = await connection
    .model('User')
    .findOne({ email: email.toLowerCase(), roles: 'admin' })
  if (!user) {
    throw new CustomError('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new CustomError('Invalid credentials')
  }

  const token = user.generateAuthToken()
  let data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    token: token,
  }

  return successResponse(res, 'Signed In successfully', { user: data })
})

module.exports = login
