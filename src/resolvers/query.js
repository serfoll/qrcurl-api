module.exports = {
  qrcodes: async (parent, args, { models }) =>
    await models.QRCode.find().limit(100),
  qrcode: async (parent, args, { models }) => {
    return await models.QRCode.findOne({
      shortCode: args.shortCode
    })
  },
  qrcodeFeed: async (parent, { cursor }, { models }) => {
    const limit = 10

    let cursorQuery = {}
    let hasNextPage = false

    //look for notes with an ObjectId less than that of the cursor
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } }
    }

    // find the limit + 1 of qrcodes in the db, sorted newest to oldest
    let qrcodes = await models.QRCode.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1)

    // set hasNextPage to true and trim the qrcodes to the limit, if there's more qrcodes than the limit
    if (qrcodes.length > limit) {
      hasNextPage = true
      qrcodes.slice(0, -1)
    }

    // set the new cursor to the object ID of the last item in the feed array
    const newCursor = qrcodes[qrcodes.length - 1]._id

    return {
      qrcodes,
      cursor: newCursor,
      hasNextPage
    }
  }
}
