const axios = require('axios')
const Joi = require('joi')
const { CustomError } = require('../../../utils/error')
const { joiValidate, joiError } = require('../../../utils/joi')
const { logError } = require('../../../utils/log')

const update = async (params) => {
  params = params || {}

  try {
    const { host, recordId } = params

    const schema = Joi.object({
      recordId: Joi.number().required(),
      host: Joi.string().required(),
    })

    const { error } = await joiValidate(schema, {
      recordId,
      host,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    try {
      const response = await axios.put(
        `${process.env.NAME_COM_API_HOST}/domains/${process.env.APP_HOST}/records/${recordId}`,
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
        throw new CustomError('Failed to update DNS record')
      }

      return response.data
    } catch (error) {
      logError(error?.message)
      throw new CustomError('Failed to update DNS record')
    }
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
