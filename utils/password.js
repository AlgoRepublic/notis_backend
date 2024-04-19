const bcrypt = require('bcrypt')

const encryptPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required')
  }

  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

module.exports = {
  encryptPassword,
}
