const mongoose = require('mongoose')

const qrcodeSchema = new mongoose.Schema(
  {
    author: { type: mongoose.ObjectId, required: true },
    description: { type: String },
    shortCode: { type: String, required: true, unique: true },
    svgCode: { type: String, required: true },
    title: { type: String },
    url: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const QRCode = mongoose.model('QRCode', qrcodeSchema)

module.exports = QRCode
