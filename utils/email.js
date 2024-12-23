const nodemailer = require('nodemailer')
const { logError } = require('./log')

const sendEmail = async (res, options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  const mailOptions = {
    from: `NotisApp <${process.env.EMAIL_ADDRESS}>`,
    to: process.env.EMAIL_DEFAULT_TO,
    cc: process.env.EMAIL_DEFAULT_CC,
    bcc: process.env.EMAIL_DEFAULT_BCC,
    subject: options.subject,
    html: options.text,
  }

  try {
    await transporter.sendMail(mailOptions)

    return true
  } catch (error) {
    logError(error)
    return false
  }
}

module.exports = { sendEmail }
