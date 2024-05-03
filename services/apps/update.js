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
      app_type,
      subDomain,
      country,
      color,
      privacy_policy,
      terms_of_use,
      copy_right_claim,
      logo,
    } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).required(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      app_type: Joi.string().valid('Job', 'Rental').optional(),
      subDomain: Joi.string().hex().length(24).optional(),
      country: Joi.string().hex().length(24).optional(),
      color: Joi.object({
        primary: Joi.string().optional(),
        secondary: Joi.string().optional(),
        text: Joi.string().optional(),
      }).optional(),
      privacy_policy: Joi.string().optional(),
      terms_of_use: Joi.string().optional(),
      copy_right_claim: Joi.string().optional(),
      logo: Joi.object().optional(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      title,
      description,
      app_type,
      subDomain,
      country,
      color,
      privacy_policy,
      terms_of_use,
      copy_right_claim,
      logo,
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

    if (app_type !== undefined) {
      app.app_type = app_type
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

    if (privacy_policy !== undefined) {
      app.privacy_policy = privacy_policy
    }

    if (terms_of_use !== undefined) {
      app.terms_of_use = terms_of_use
    }

    if (copy_right_claim !== undefined) {
      app.copy_right_claim = copy_right_claim
    }

    if (logo !== undefined) {
      app.logo = await saveFile(logo, 'admin/apps/logo')
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
