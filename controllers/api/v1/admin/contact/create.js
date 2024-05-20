const { aysncMiddleware } = require('../../../../../middlewares/async')
const { sendEmail } = require('../../../../../utils/email')

const create = aysncMiddleware(async (req, res, next) => {
  const { email, message } = req.body

  const emailOptions = {
    to: email,
    cc: 'info@algorepublic.com',
    subject: 'Contact Email',
    text: message,
  }

  await sendEmail(res, emailOptions)
})

module.exports = create
