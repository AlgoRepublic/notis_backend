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
        throw new CustomError(req.t('45'))
      }

      const device = await connection
        .model('Device')
        .findOne({ fcmToken })
        .lean()
        .exec()

      if (!device) throw new CustomError(req.t('46'))

      req.device = device

      next()
    } catch (err) {
      logError(err)
      return errorResponse(res, err?.message)
    }
  } else {
    return errorResponse(res, req.t('47'))
  }
}

module.exports = ensureDevice
