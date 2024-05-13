const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
  params = params || {}

  try {
    const { title, description, entity, location, url, createdBy } = params

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      entity: Joi.string().required(),
      location: Joi.string().required(),
      url: Joi.string().required(),
      createdBy: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
      title,
      description,
      entity,
      location,
      url,
      createdBy,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const post = new (dbConnection.model('Post'))({
      title,
      description,
      entity,
      location,
      url,
      createdBy,
    })

    await post.save()

    return post
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = create
