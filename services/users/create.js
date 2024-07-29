const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { encryptPassword } = require('../../utils/password')
const { translate } = require('../../utils/i18n')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const User = await dbConnection.model('User')

    const { locale, name, email, password, roles, subDomains } = params

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      roles: Joi.array()
        .items(Joi.string().valid('admin', 'creator'))
        .required(),
      subDomains: Joi.array().items(Joi.string().hex().length(24)).required(),
    })

    const { error } = await joiValidate(schema, {
      name,
      email,
      password,
      roles,
      subDomains,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const userExists = await User.findOne({ email }).lean().exec()

    if (userExists) {
      throw new CustomError(translate('73', locale))
    }

    const user = new User()
    user.name = name
    user.email = email
    user.password = await encryptPassword(password)
    user.roles = roles
    user.subDomains = subDomains
    await user.save()

    return user
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
