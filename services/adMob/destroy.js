const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { translate } = require('../../utils/i18n')

const destroy = async (dbConnection, params) => {
  params = params || {}

  try {
    const { locale, _id } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, { _id })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const adMob = await dbConnection.model('AdMob').findOne({ _id }).exec()

    if (!adMob) {
      throw new CustomError(translate('58', locale))
    }

    await adMob.deleteOne()

    return true
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = destroy
