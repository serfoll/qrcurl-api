module.exports = {
  qrcodes: async (parent, args, { models }) => await models.QRCode.find(),
  qrcode: async (parent, args, { models }) => {
    return await models.QRCode.findOne({
      shortCode: args.shortCode
    })
  }
}
