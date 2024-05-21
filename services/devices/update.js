const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const { oldFcmToken, fcmToken, sendNotification } = params

    const schema = Joi.object({
      oldFcmToken: Joi.string().optional(),
      fcmToken: Joi.string().required(),
      sendNotification: Joi.boolean().optional(),
    })

    const { error } = await joiValidate(schema, {
      oldFcmToken,
      fcmToken,
      sendNotification,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    let device = await dbConnection
      .model('Device')
      .findOne({ fcmToken: oldFcmToken ? oldFcmToken : fcmToken })
      .exec()

    if (!device) {
      device = await dbConnection.model('Device').findOne({ fcmToken }).exec()
    }

    if (!device) {
      device = new (dbConnection.model('Device'))()
    }

    device.fcmToken = fcmToken
    device.sendNotification = !!sendNotification
    await device.save()

    return device
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
