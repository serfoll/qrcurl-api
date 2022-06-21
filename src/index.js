require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const app = express()

var QRCode = require('qrcode-svg')
// Middlewares
app.use(cors())

// eslint-disable-next-line no-undef

const qr = new QRCode({
  content: 'http://github.com/',
  padding: 4,
  width: 256,
  height: 256,
  color: '#000000',
  background: '#ffffff',
  ecl: 'M'
})

function generateShortCode(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

app.get('/', (req, res) => {
  res.send(` <div>${generateShortCode(6)}<br/>${qr.svg()}</div>`)
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`App runing at http://localhost:${port}`)
})
