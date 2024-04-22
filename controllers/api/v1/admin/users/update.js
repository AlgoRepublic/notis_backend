const updateUserService = require('../../../../../services/users/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params
  const { name, email, password, roles } = req.body
  const user = await updateUserService(connection, {
    _id,
    name,
    email,
    password,
    roles,
  })

  return successResponse(res, 'User updated successfully', {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  })
})

module.exports = update
