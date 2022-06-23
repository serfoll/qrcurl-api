const generateShortCode = require('../generateShortCode')
const QRCodeSvg = require('qrcode-svg')

let qr = new QRCodeSvg({
  background: '#ffffff',
  color: '#000000',
  container: 'svg-viewbox',
  content: 'placeholder',
  ecl: 'Q',
  height: 60,
  join: true,
  padding: 0,
  pretty: true,
  width: 60
})

module.exports = {
  deleteQRCode: async (parent, { id }, { models }) => {
    try {
      await models.QRCode.findOneAndRemove({ _id: id })
      return true
    } catch (err) {
      return false
    }
  },
  newQRCode: async (parent, args, { models }) => {
    let url = args.url

    qr.content = url

    let qrcodeValue = {
      description: args.description,
      shortCode: generateShortCode(6),
      svgCode: qr.svg(),
      title: args.title,
      url: url
    }

    return await models.QRCode.create(qrcodeValue)
  },
  updateQRCode: async (parent, { description, id, title, url }, { models }) => {
    qr.content = url
    let svgCode = qr.svg()

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
