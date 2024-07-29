const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { logError } = require('../../utils/log')
const { firebaseSendNotification } = require('../../utils/firebase')
const { translate } = require('../../utils/i18n')

const sendAlert = async (dbConnection, params) => {
  params = params || {}

  try {
    if (!dbConnection) {
      throw new CustomError('No db connection')
    }

    const { locale, _id, subDomainId } = params

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
      if (!search.title && !search.location) {
        continue
      }

      const rentals = await dbConnection.model('Rental').esSearch(
        {
          query: {
            bool: {
              must: [
                {
                  ids: {
                    values: [_id],
                  },
                },
                ...(search.title
                  ? [
                      {
                        multi_match: {
                          query: search.title,
                          fields: [
                            'title',
                            'description',
                            'entity',
                            'summary',
                            'price',
                          ],
                          fuzziness: 'auto',
                        },
                      },
                    ]
                  : []),
                ...(search.location
                  ? [
                      {
                        match: {
                          location: {
                            query: search.location,
                            fuzziness: 'auto',
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        },
        {
          index: dbConnection.model('Rental').indexName(subDomainId),
        }
      )

      if (rentals.statusCode === 200 && rentals.body.hits.total > 0) {
        const rental = rentals.body.hits.hits[0]

        const alert = await dbConnection.model('Alert').findOneAndUpdate(
          {
            rental: rental._id,
            device: search.device,
          },
          {
            rental: rental._id,
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
                rentalId: rental._id,
                alertId: alert._id.toString(),
                url: rental._source.url,
              },
              notification: {
                title: translate('70', locale),
                body: rental._source.title,
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
