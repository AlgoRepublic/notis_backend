const { logError } = require('../../utils/log')
const { encryptPassword } = require('../../utils/password')

const seedUsers = async (connection) => {
  const User = connection.model('User')

  try {
    await User.findOneAndUpdate(
      { email: 'admin@admin.com' },
      {
        email: 'admin@admin.com',
        password: await encryptPassword('admin@123'),
        role: ['admin'],
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )
  } catch (error) {
    logError(error)
  }
}

module.exports = seedUsers
