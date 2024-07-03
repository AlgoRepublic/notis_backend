const createUserService = require('../../../../../services/users/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { name, email, password, roles, subDomains } = req.body
  let user = await createUserService(connection, {
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

  return successResponse(res, req.t('31'), {
    user,
  })
})

module.exports = create
