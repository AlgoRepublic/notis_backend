const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { logError } = require('../../utils/log')
const { firebaseSendNotification } = require('../../utils/firebase')

const sendAlert = async (dbConnection, params) => {
  params = params || {}

  try {
    if (!dbConnection) {
      throw new CustomError('No db connection')
    }

    const { _id } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
      _id,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const searches = await dbConnection.model('Search').find().lean()

    for (const search of searches) {
      const query = {}

      if (search.title || search.location) {
        query.$and = []
      } else {
        continue
      }

      if (search.title) {
        query.$and.push({
          $or: [
            { title: { $regex: new RegExp(search.title, 'i') } },
            { description: { $regex: new RegExp(search.title, 'i') } },
            { entity: { $regex: new RegExp(search.title, 'i') } },
          ],
        })
      }

      if (search.location) {
        query.$and.push({
          location: { $regex: new RegExp(search.location, 'i') },
        })
      }

      const job = await dbConnection
        .model('Job')
        .findOne({ _id, ...query })
        .lean()
        .exec()

      if (job) {
        const alert = await dbConnection.model('Alert').findOneAndUpdate(
          {
            job: job._id,
            device: search.device,
          },
          {
            job: job._id,
            device: search.device,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
          }
        )

        await alert.save()

        if (!alert.pushNotificationSent) {
          try {
            const device = await dbConnection
              .model('Device')
              .findOne({ _id: search.device })
              .lean()
              .exec()

            const message = {
              data: {
                jobId: job._id.toString(),
                url: job.url,
              },
              notification: {
                title: 'Job Alert',
                body: job.title,
              },
              token: device.fcmToken,
            }

            alert.pushNotificationSent = await firebaseSendNotification(message)
            await alert.save()
          } catch (error) {
            logError(error)
          }
        }
      }
    }

    return true
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = sendAlert
