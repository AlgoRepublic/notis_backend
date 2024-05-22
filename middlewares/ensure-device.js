const Joi = require('joi')
const { errorResponse } = require('../utils/response')
const { logError } = require('../utils/log')
const { CustomError } = require('../utils/error')
const { joiValidate } = require('../utils/joi')

const ensureDevice = async (req, res, next) => {
  const connection = req.sdbConnection

  const fcmToken = req?.header('FCMToken')

  if (fcmToken) {
    try {
      const schema = Joi.object({
        fcmToken: Joi.string().required(),
      })

      const { error } = await joiValidate(schema, {
        fcmToken,
      })

      if (error) {
        throw new CustomError('FCMToken cannot be empty')
      }

      const device = await connection
        .model('Device')
        .findOne({ fcmToken })
        .lean()
        .exec()

      if (!device) throw new CustomError('Invalid FCMToken')

      req.device = device

      next()
    } catch (err) {
      logError(err)
      return errorResponse(res, err?.message)
    }
  } else {
    return errorResponse(res, 'FCMToken is missing')
  }
}

module.exports = ensureDevice
