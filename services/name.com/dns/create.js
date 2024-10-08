const axios = require('axios')
const Joi = require('joi')
const { CustomError } = require('../../../utils/error')
const { joiValidate, joiError } = require('../../../utils/joi')
const { logError } = require('../../../utils/log')
const { translate } = require('../../../utils/i18n')

const create = async (params) => {
  params = params || {}

  try {
    const { locale, host } = params

    const schema = Joi.object({
      host: Joi.string().required(),
    })

    const { error } = await joiValidate(schema, {
      host,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    try {
      const response = await axios.post(
        `${process.env.NAME_COM_API_HOST}/domains/${process.env.APP_HOST}/records`,
        {
          hostName: process.env.APP_HOST,
          host: host,
          type: 'A',
          answer: process.env.NAME_COM_SUBDOMAIN_ANSWER,
          ttl: 300,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          auth: {
            username: process.env.NAME_COM_API_USERNAME,
            password: process.env.NAME_COM_API_PASSWORD,
          },
        }
      )

      if (response.status !== 200) {
        logError(response)
        throw new CustomError(translate('64', locale))
      }

      return response.data
    } catch (error) {
      logError(error?.message)
      throw new CustomError(translate('64', locale))
    }
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
