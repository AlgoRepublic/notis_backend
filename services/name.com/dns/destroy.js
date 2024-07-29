const axios = require('axios')
const Joi = require('joi')
const { CustomError } = require('../../../utils/error')
const { joiValidate, joiError } = require('../../../utils/joi')
const { logError } = require('../../../utils/log')
const { translate } = require('../../../utils/i18n')

const destroy = async (params) => {
  params = params || {}

  try {
    const { locale, recordId } = params

    const schema = Joi.object({
      recordId: Joi.number().required(),
    })

    const { error } = await joiValidate(schema, {
      recordId,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    try {
      const response = await axios.delete(
        `${process.env.NAME_COM_API_HOST}/domains/${process.env.APP_HOST}/records/${recordId}`,
        {
          auth: {
            username: process.env.NAME_COM_API_USERNAME,
            password: process.env.NAME_COM_API_PASSWORD,
          },
        }
      )

      if (response.status !== 200) {
        throw new CustomError(translate('65', locale))
      }

      return true
    } catch (error) {
      logError(error?.message)
      throw new CustomError(translate('65', locale))
    }
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = destroy
