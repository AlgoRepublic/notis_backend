const Joi = require('joi')
const queue = require('../../utils/bull')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { translate } = require('../../utils/i18n')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const { locale, title, location, device, subDomain, subDomainId } = params

    const schema = Joi.object({
      title: Joi.string().allow('').optional(),
      location: Joi.string().allow('').optional(),
      device: Joi.string().hex().length(24).required(),
      subDomain: Joi.string().optional(),
      subDomainId: Joi.string().hex().length(24).optional(),
    })

    const { error } = await joiValidate(schema, {
      title,
      location,
      device,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    if (!title && !location) {
      throw new CustomError(translate('71', locale))
    }

    const search = await dbConnection.model('Search').findOneAndUpdate(
      {
        title,
        location,
        device,
      },
      {
        title,
        location,
        device,
      },
      {
        new: true,
        lean: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    await dbConnection
      .model('Device')
      .findOneAndUpdate(
        { _id: device },
        { $addToSet: { searches: search._id } }
      )

    if (subDomain && subDomainId) {
      await queue.add('sendJobAlert', {
        subDomain,
        subDomainId,
        searchId: search._id.toString(),
      })

      await queue.add('sendRentalAlert', {
        subDomain,
        subDomainId,
        searchId: search._id.toString(),
      })
    }

    return search
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
