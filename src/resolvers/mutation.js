const generateShortCode = require('../generateShortCode')
const QRCodeSvg = require('qrcode-svg')

module.exports = {
  newQRCode: async (parent, args, { models }) => {
    let url = args.url

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
      description: 'Solo links',
      shortCode: generateShortCode(6),
      svgCode: qr.svg(),
      title: 'Solo',
      url: url
    }

    return await models.QRCode.create(qrcodeValue)
  }
}
