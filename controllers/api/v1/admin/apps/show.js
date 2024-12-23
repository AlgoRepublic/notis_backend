const Joi = require('joi')
const { CustomError } = require('../../../../../utils/error')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const show = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection

  const { _id } = req.params

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
  })

  const { error } = await joiValidate(schema, {
    _id,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const app = await connection
    .model('App')
    .findOne({ _id })
    .populate({ path: 'subDomain', select: { host: 1 } })
    .populate({ path: 'country', select: { name: 1 } })
    .select({
      title: 1,
      description: 1,
      appType: 1,
      color: 1,
      subDomain: 1,
      country: 1,
      privacyPolicy: 1,
      termsOfUse: 1,
      copyRightClaim: 1,
      logo: 1,
      adsEnabled: 1,
      enAIText: 1,
      esAIText: 1,
      enFeedbackPopUpText: 1,
      enFeedbackPopUpDescText: 1,
      esFeedbackPopUpText: 1,
      esFeedbackPopUpDescText: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('9'), {
    app,
  })
})

module.exports = show
