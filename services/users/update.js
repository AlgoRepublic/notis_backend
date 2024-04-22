const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { encryptPassword } = require('../../utils/password')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const User = await dbConnection.model('User')

    const { _id, name, email, password, roles } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      name: Joi.string().required().optional(),
      email: Joi.string().required().optional(),
      password: Joi.string().required().optional(),
      roles: Joi.array()
        .items(Joi.string().valid('admin', 'creator'))
        .optional(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      name,
      email,
      password,
      roles,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    if (email) {
      const userExists = await User.findOne({
        _id: { $ne: _id },
        email: email.toLowerCase(),
      })
        .lean()
        .exec()

      if (userExists) {
        throw new CustomError('User already exists')
      }
    }

    const user = await User.findOne({
      _id: _id,
    }).exec()

    if (user) {
      user.name = name
    }
    if (email) {
      user.email = email
    }
    if (password) {
      user.password = await encryptPassword(password)
    }
    if (roles) {
      user.roles = roles
    }
    await user.save()

    return user
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
