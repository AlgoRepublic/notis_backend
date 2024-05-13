const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const update = async (dbConnection, params) => {
  params = params || {}

  try {
    const { _id, title, description, entity, location, url, updatedBy } = params

    const schema = Joi.object({
      _id: Joi.string().hex().length(24).optional(),
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      entity: Joi.string().optional(),
      location: Joi.string().optional(),
      url: Joi.string().optional(),
      updatedBy: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
      _id,
      title,
      description,
      entity,
      location,
      url,
      updatedBy,
    })

    if (error) {
      throw new CustomError(joiError(error))
    }

    const post = await dbConnection.model('Post').findOne({ _id }).exec()

    if (!post) {
      throw new CustomError('Post not found')
    }

    if (title !== undefined) {
      post.title = title
    }

    if (description !== undefined) {
      post.description = description
    }

    if (entity !== undefined) {
      post.entity = entity
    }

    if (location !== undefined) {
      post.location = location
    }

    if (url !== undefined) {
      post.url = url
    }

    post.updatedBy = updatedBy

    await post.save()

    return post
  } catch (error) {
    throw new CustomError(error?.message)
  }
}

module.exports = update
