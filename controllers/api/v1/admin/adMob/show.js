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

  const adMob = await connection
    .model('AdMob')
    .findOne({
      _id,
    })
    .populate({
      path: 'subDomains',
      select: {
        host: 1,
      },
    })
    .select({
      adType: 1,
      code: 1,
    })
    .lean()
    .exec()

  return successResponse(res, req.t('6'), {
    adMob,
  })
})

module.exports = show
