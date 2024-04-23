const axios = require('axios')
const Joi = require('joi')
const { CustomError } = require('../../../utils/error')
const { joiValidate, joiError } = require('../../../utils/joi')

const create = async (params) => {
  params = params || {}

  try {
    const { host } = params

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
        throw new CustomError('Failed to create DNS record')
      }

      return response.data
    } catch (error) {
      throw new CustomError('Failed to create DNS record')
    }
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
