const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const partials = require('../partials')
require('dotenv').config()

module.exports = {
  deleteQRCode: async (parent, { id }, { models, author }) => {
    if (!author) throw new AuthenticationError('You cannot delete this QRCode')

    const qrcode = await models.QRCode.findById(id)

    try {
      await qrcode.remove()
      return true
    } catch (err) {
      return false
    }
  },
  newQRCode: async (
    parent,
    { description, title, url },
    { models, author }
  ) => {
    partials.QRCode.content = url

    let qrcodeValue = {
      author: '',
      description: description,
      shortCode: partials.GenerateShortCode(6),
      svgCode: partials.QRCode.svg(),
      title: title,
      url: url
    }

    //new temp author
    if (!author) {
      const newAuthorId = new mongoose.Types.ObjectId()

      author = await jwt.sign({ id: newAuthorId }, process.env.JWT_SECRET)

      qrcodeValue.author = mongoose.Types.ObjectId(newAuthorId)

      console.log(author)
    } else qrcodeValue.author = mongoose.Types.ObjectId(author.id)

    //check for duplicates
    const qrcode = await models.QRCode.find({
      author: author.id,
      url: url
    })

    if (qrcode.length > 0) {
      return qrcode[0]
    }

    //create new qrcode
    try {
      return await models.QRCode.create(qrcodeValue)
    } catch (err) {
      console.log(err)
      throw new Error('Error creating QRCode')
    }
  },
  updateQRCode: async (
    parent,
    { description, id, title, url },
    { models, author }
  ) => {
    if (!author) throw new Error('You cannot update this QRCode')

    partials.QRCode.content = url

    let svgCode = partials.QRCode.svg()

    const qrcode = await models.QRCode.findById(id)

    if (qrcode && String(qrcode.author) !== author.id)
      throw new ForbiddenError(
        'You do not have permission to update this QRCode'
      )

    return await models.QRCode.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          description,
          svgCode,
          title,
          url
        }
      },
      {
        new: true
      }
    )
  }
}
