const mongoose = require('mongoose')

const qrcodeSchema = new mongoose.Schema(
  {
    author: {
      ref: 'Author',
      required: true,
      type: mongoose.Schema.Types.ObjectId
    },
    description: { type: String },
    hexCode: { type: String, required: true },
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
