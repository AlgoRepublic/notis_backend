const updateUserService = require('../../../../../services/users/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  const { name, email, password, roles, subDomains } = req.body
  let user = await updateUserService(connection, {
    locale: req.getLocale(),
    _id,
    name,
    email,
    password,
    roles,
    subDomains,
  })

  user = await connection
    .model('User')
    .findOne({ _id: user._id })
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

  return successResponse(res, req.t('35'), {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  })
})

module.exports = update
