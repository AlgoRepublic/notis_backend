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

    const rental = await dbConnection.model('Rental').findOne({ _id }).exec()

    if (!rental) {
      throw new CustomError(translate('67', locale))
    }

    await rental.removeIndex()
    await dbConnection.model('Alert').deleteMany({ rental: rental._id })
    await rental.deleteOne()

    return true
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = destroy
