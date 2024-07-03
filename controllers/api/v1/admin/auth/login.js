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

  const query = {
    $or: [
      {
        roles: 'admin',
      },
      ...(req.subDomainId
        ? [
            {
              roles: 'creator',
              subDomains: req.subDomainId,
            },
          ]
        : []),
    ],
  }

  // if (req.subDomain === 'www' || !req.subDomain) {
  //   query.roles = 'admin'
  // } else {
  //   query.roles = 'creator'
  //   query.subDomains = req.subDomainId
  // }

  let user = await connection
    .model('User')
    .findOne({ email: email.toLowerCase(), ...query })
  if (!user) {
    throw new CustomError(req.t('2'))
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new CustomError(req.t('2'))
  }

  const token = user.generateAuthToken()
  let data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    token: token,
  }

  return successResponse(res, req.t('1'), { user: data })
})

module.exports = login
