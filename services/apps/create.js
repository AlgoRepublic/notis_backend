const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { saveFile } = require('../../utils/storage')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
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
    } = params

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional(),
      appType: Joi.string().valid('Job', 'Rental').required(),
      subDomain: Joi.string().hex().length(24).required(),
      country: Joi.string().hex().length(24).required(),
      color: Joi.object({
        primary: Joi.string().required(),
        secondary: Joi.string().required(),
        text: Joi.string().required(),
      }).required(),
      privacyPolicy: Joi.string().required(),
      termsOfUse: Joi.string().required(),
      copyRightClaim: Joi.string().required(),
      logo: Joi.object().required(),
    })

    const { error } = await joiValidate(schema, {
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
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const subDomainAlreadyUsed = await dbConnection
      .model('App')
      .findOne({ subDomain })
      .lean()
      .exec()

    if (subDomainAlreadyUsed) {
      throw new CustomError('Sub domain already used')
    }

    const logoPath = await saveFile(logo, 'admin/apps/logo')

    const app = new (dbConnection.model('App'))({
      title,
      description,
      appType,
      subDomain,
      country,
      color,
      privacyPolicy,
      termsOfUse,
      copyRightClaim,
      logo: logoPath,
    })

    await app.save()

    await dbConnection
      .model('SubDomain')
      .updateOne({ _id: app.subDomain }, { $set: { app: app._id } })

    return app
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
