const { aysncMiddleware } = require('../../../../../middlewares/async')
const { sendEmail } = require('../../../../../utils/email')
const {
  successResponse,
  errorResponse,
} = require('../../../../../utils/response')

const send = aysncMiddleware(async (req, res, next) => {
  const { name, email, subject, message } = req.body
  const textmessage = `<div style="color:#000000">
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Name : </strong></div>
                                <div>${name}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Email : </strong></div>
                                <div>${email}</div>
                           </div>
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Subject : </strong></div>
                                <div>${subject}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Message : </strong></div>
                                <div>${message}</div>
                            </div>     
                        <div>
    `

  const emailOptions = {
    subject: req.t('12'),
    text: textmessage,
  }

  const result = await sendEmail(res, emailOptions)
  if (result) {
    return successResponse(res, 'Contact email sent successfully')
  } else {
    return errorResponse(res, 'Failed to send contact email')
  }
})

module.exports = send
