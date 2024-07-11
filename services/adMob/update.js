const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const AdMob = await dbConnection.model('AdMob')

    const { _id, adType, code } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      adType: Joi.string()
        .valid('Interstitial', 'Native', 'Rewarded', 'OpenAd')
        .optional(),
      code: Joi.string().optional(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      adType,
      code,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const adMob = await AdMob.findOne({
      _id: _id,
    }).exec()

    if (adType !== undefined) {
      adMob.adType = adType
    }
    if (code !== undefined) {
      adMob.code = code
    }

    await adMob.save()

    return adMob
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
