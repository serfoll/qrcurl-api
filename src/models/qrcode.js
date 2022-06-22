const mongoose = require('mongoose')

const qrcodeSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    svgCode: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String }
  },
  {
    timestamps: true
  }
)

const QRCode = mongoose.model('QRCode', qrcodeSchema)

module.exports = QRCode
