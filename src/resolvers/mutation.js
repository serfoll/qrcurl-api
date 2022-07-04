const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const partials = require('../partials')
const QRCodeSvg = require('qrcode-svg')

require('dotenv').config()

module.exports = {
  createLocalAuthor: (parent, args, { models, author }) => {
    if (!author) {
      //new temp author
      const newAuthorId = new mongoose.Types.ObjectId()

      return jwt.sign({ id: newAuthorId }, process.env.JWT_SECRET)
    } else return 'Local user already exists!'
  },
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
    { description, hexCode, title, url },
    { models, author }
  ) => {
    let qr = new QRCodeSvg({
      background: '#ffffff',
      color: '#000000',
      container: 'svg-viewbox',
      content: url,
      ecl: 'Q',
      height: 60,
      join: true,
      padding: 0,
      pretty: true,
      width: 60
    })

    let qrcodeValue = {
      description: description,
      hexCode: hexCode,
      shortCode: partials.GenerateShortCode(6),
      svgCode: qr.svg(),
      title: title,
      url: url
    }

    if (author) {
      qrcodeValue.author = author.id

      const qrcode = await models.QRCode.find({
        author: author.id,
        url: url
      })

      if (qrcode.length > 0) {
        return qrcode[0]
      }
    }
    // console.log(author)
    //check for duplicates

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
