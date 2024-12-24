const Joi = require('joi')
const { ObjectId } = require('mongoose').Types
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

    const { locale, _id, subDomainId, searchId } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).optional(),
      searchId: Joi.string().hex().length(24).optional(),
    })

    const { error } = await joiValidate(schema, {
      _id,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const searches = await dbConnection
      .model('Search')
      .find({
        ...(searchId
          ? {
              _id: new ObjectId(searchId),
            }
          : {}),
      })
      .lean()

    for (const search of searches) {
      if (!search.title && !search.location) {
        continue
      }

      const jobs = await dbConnection.model('Job').esSearch(
        {
          size: 10000,
          query: {
            bool: {
              must: [
                ...(_id
                  ? [
                      {
                        ids: {
                          values: [_id],
                        },
                      },
                    ]
                  : []),
                ...(search.title
                  ? [
                      {
                        multi_match: {
                          query: search.title,
                          fields: ['title', 'description', 'entity'],
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
                            operator: 'and',
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
          index: dbConnection.model('Job').indexName(subDomainId),
        }
      )

      if (jobs.statusCode === 200 && jobs.body.hits.total > 0) {
        const hits = jobs.body.hits.hits

        for (const job of hits) {
          try {
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
                    jobId: job._id,
                    alertId: alert._id.toString(),
                    url: job._source.url,
                  },
                  notification: {
                    title: translate('63', locale),
                    body: job._source.title,
                  },
                  token: device.fcmToken,
                }

                alert.pushNotificationSent =
                  await firebaseSendNotification(message)
                await alert.save()
              } catch (error) {
                logError(error)
              }
            }
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
