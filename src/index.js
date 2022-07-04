// Third parties module imports
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const { createComplexityLimitRule } = require('graphql-validation-complexity')
const depthLimit = require('graphql-depth-limit')
const express = require('express')
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
const QRCodeSvg = require('qrcode-svg')

require('dotenv').config()

//local module imports
const db = require('./db')
const models = require('./models')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const partials = require('./partials')

//connect to db
const DB_HOST = process.env.DB_HOST
db.connect(DB_HOST)

//express and apollo server server
const app = express()
const port = process.env.PORT || 4000

//
const getAuthor = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      // if there's a problem with the token
      throw new Error('Session invalid')
    }
  }
}

const server = new ApolloServer({
  context: ({ req }) => {
    const token = req.headers.authorization
    const author = getAuthor(token)

    return { models, author }
  },
  resolvers,
  typeDefs,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)]
})

// Express Middlewares
app.use(cors())
app.use(helmet())

app.get('/', async (req, res) => {
  partials.QRCode.content = await 'http://localhost:4000/'

  let qr = new QRCodeSvg({
    background: '#ffffff',
    color: '#000000',
    container: 'svg-viewbox',
    content: 'http://localhost:4000/',
    ecl: 'Q',
    height: 60,
    join: true,
    padding: 0,
    pretty: true,
    width: 60
  })

  let qrcodeValue = {
    author: 'aa',
    description: 'a',
    hexCode: '#fff',
    shortCode: partials.GenerateShortCode(6),
    svgCode: qr.svg(),
    title: 'yupp',
    url: 'http://localhost:4000/'
  }

  res.send(qrcodeValue.svgCode)
})

server.start().then(() => {
  //Apollo server middlewares
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`App runing at http://localhost:${port}${server.graphqlPath}`)
  })
})
