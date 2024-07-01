const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { saveFile } = require('../../utils/storage')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
      _id,
      title,
      description,
      appType,
      subDomain,
      country,
      color,
      privacyPolicy,
      termsOfUse,
      copyRightClaim,
      logo,
      adsEnabled,
    } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      appType: Joi.string().valid('Job', 'Rental').optional(),
      subDomain: Joi.string().hex().length(24).optional(),
      country: Joi.string().hex().length(24).optional(),
      color: Joi.object({
        primary: Joi.string().optional(),
        secondary: Joi.string().optional(),
        text: Joi.string().optional(),
      }).optional(),
      privacyPolicy: Joi.string().optional(),
      termsOfUse: Joi.string().optional(),
      copyRightClaim: Joi.string().optional(),
      logo: Joi.object().optional(),
      adsEnabled: Joi.boolean().optional(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      title,
      description,
      appType,
      subDomain,
      country,
      color,
      privacyPolicy,
      termsOfUse,
      copyRightClaim,
      logo,
      adsEnabled,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const app = await dbConnection.model('App').findOne({ _id }).exec()

    if (!app) {
      throw new CustomError('App not found')
    }

    if (title !== undefined) {
      app.title = title
    }

    if (description !== undefined) {
      app.description = description
    }

    if (appType !== undefined) {
      app.appType = appType
    }

    if (subDomain !== undefined) {
      const subDomainAlreadyUsed = await dbConnection
        .model('App')
        .findOne({ _id: { $ne: app._id }, subDomain })
        .lean()
        .exec()

      if (subDomainAlreadyUsed) {
        throw new CustomError('Sub domain already used')
      }

      app.subDomain = subDomain
    }

    if (country !== undefined) {
      app.country = country
    }

    if (!app.color) {
      app.color = {}
    }

    if (color && color.primary !== undefined) {
      app.color.primary = color.primary
    }

    if (color && color.secondary !== undefined) {
      app.color.secondary = color.secondary
    }

    if (color && color.text !== undefined) {
      app.color.text = color.text
    }

    if (privacyPolicy !== undefined) {
      app.privacyPolicy = privacyPolicy
    }

    if (termsOfUse !== undefined) {
      app.termsOfUse = termsOfUse
    }

    if (copyRightClaim !== undefined) {
      app.copyRightClaim = copyRightClaim
    }

    if (logo !== undefined) {
      app.logo = await saveFile(logo, 'admin/apps/logo')
    }

    if (adsEnabled !== undefined) {
      app.adsEnabled = adsEnabled
    }

    await app.save()

    await dbConnection
      .model('SubDomain')
      .updateOne({ _id: app.subDomain }, { $set: { app: app._id } })

    return app
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
