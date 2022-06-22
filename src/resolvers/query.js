module.exports = {
  qrcodes: async ({ models }) => await models.QRCode.find(),
  qrcode: async (args, { models }) => {
    return await models.QRCode.findOne({
      shortCode: args.shortCode
    })
  }
}
