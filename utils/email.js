const nodemailer = require('nodemailer')
const { successResponse, errorResponse } = require('./response')
const { logError } = require('./log')

const sendEmail = (res, options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  const mailOptions = {
    from: `AlgoRepublic <${process.env.EMAIL_ADDRESS}>`,
    to: options.to,
    cc: options.cc,
    subject: options.subject,
    html: options.text,
  }

  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      logError(err)
      return errorResponse(res, 'Unable to Send Email')
    } else {
      return successResponse(res, 'Email Send Successfully')
    }
  })
}

module.exports = { sendEmail }
