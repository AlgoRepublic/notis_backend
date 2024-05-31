const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const AdMob = await dbConnection.model('AdMob')

    const { adType, code } = params

    const schema = Joi.object({
      adType: Joi.string().required(),
      code: Joi.string().required(),
    })

    const { error } = await joiValidate(schema, {
      adType,
      code,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const adMob = new AdMob()
    adMob.adType = adType
    adMob.code = code

    await adMob.save()

    return adMob
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
