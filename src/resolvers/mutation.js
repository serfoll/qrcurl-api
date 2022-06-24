const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const partials = require('../partials')
require('dotenv').config()

module.exports = {
  deleteQRCode: async (parent, { id }, { models }) => {
    try {
      await models.QRCode.findOneAndRemove({ _id: id })
      return true
    } catch (err) {
      return false
    }
  },
  newQRCode: async (parent, { description, title, url }, { models, user }) => {
    partials.QRCode.content = url

    let qrcodeValue = {
      author: '',
      description: description,
      shortCode: partials.GenerateShortCode(6),
      svgCode: partials.QRCode.svg(),
      title: title,
      url: url
    }

    //new temp user
    if (!user) {
      const newAuthorId = new mongoose.Types.ObjectId()

      user = await jwt.sign({ id: newAuthorId }, process.env.JWT_SECRET)

      qrcodeValue.author = mongoose.Types.ObjectId(newAuthorId)

      console.log(user)
    } else qrcodeValue.author = mongoose.Types.ObjectId(user.id)

    //create new qrcode
    try {
      return await models.QRCode.create(qrcodeValue)
    } catch (err) {
      console.log(err)
      throw new Error('Error creating QRCode')
    }
  },
  updateQRCode: async (parent, { description, id, title, url }, { models }) => {
    partials.QRCode.content = url
    let svgCode = partials.QRCode.svg()

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
