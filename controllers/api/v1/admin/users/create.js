const createUserService = require('../../../../../services/users/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { name, email, password, roles } = req.body
  const user = await createUserService(connection, {
    name,
    email,
    password,
    roles,
  })

  return successResponse(res, 'User create successfully', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  })
})

module.exports = create
