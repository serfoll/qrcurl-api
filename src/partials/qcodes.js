const QRCodeSvg = require('qrcode-svg')

module.exports = new QRCodeSvg({
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
