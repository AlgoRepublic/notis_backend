const Joi = require('joi')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { sendEmail } = require('../../../../../utils/email')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { CustomError } = require('../../../../../utils/error')
const {
  successResponse,
  errorResponse,
} = require('../../../../../utils/response')

const send = aysncMiddleware(async (req, res, next) => {
  const { message } = req.body

  const schema = Joi.object({
    message: Joi.string().required(),
  })

  const { error } = await joiValidate(schema, {
    message,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const html = `
      <div style="color:#000000">
        <div style="display:flex;">
          <div style="min-width:8%"><strong>Feedback : </strong></div>
          <div>${message}</div>
        </div>
      <div>
    `

  const emailOptions = {
    subject: req.t('74'),
    text: html,
  }

  const result = await sendEmail(res, emailOptions)
  if (result) {
    return successResponse(res, 'Feedback email sent successfully')
  } else {
    return errorResponse(res, 'Failed to send feedback email')
  }
})

module.exports = send
