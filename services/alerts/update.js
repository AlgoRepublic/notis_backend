const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { translate } = require('../../utils/i18n')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const { locale, _id, viewed } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      viewed: Joi.boolean().required(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      viewed,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const alert = await dbConnection.model('Alert').findOne({ _id }).exec()

    if (!alert) {
      throw new CustomError(translate('59', locale))
    }

    alert.viewed = viewed

    await alert.save()

    return alert
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
