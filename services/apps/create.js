const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const {
      title,
      description,
      app_type,
      subDomain,
      country,
      color,
      privacy_policy,
      terms_of_use,
      copy_right_claim,
    } = params

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      app_type: Joi.string().valid('Job', 'Rental').required(),
      subDomain: Joi.string().hex().length(24).required(),
      country: Joi.string().hex().length(24).required(),
      color: Joi.object({
        primary: Joi.string().required(),
        secondary: Joi.string().required(),
        text: Joi.string().required(),
      }).required(),
      privacy_policy: Joi.string().required(),
      terms_of_use: Joi.string().required(),
      copy_right_claim: Joi.string().required(),
    })

    const { error } = await joiValidate(schema, {
      title,
      description,
      app_type,
      subDomain,
      country,
      color,
      privacy_policy,
      terms_of_use,
      copy_right_claim,
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

    const app = new (dbConnection.model('App'))({
      title,
      description,
      app_type,
      subDomain,
      country,
      color,
      privacy_policy,
      terms_of_use,
      copy_right_claim,
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
