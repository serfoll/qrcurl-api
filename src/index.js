require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')

const QRCode = require('qrcode-svg')

const qr = new QRCode({
  background: '#ffffff',
  color: '#000000',
  container: 'svg-viewbox',
  content: 'http://github.com/',
  ecl: 'Q',
  height: 60,
  join: true,
  padding: 0,
  pretty: true,
  width: 60
})

const generateShortCode = length => {
  var result = ''
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

//basic schema, using GraphQL
const typeDefs = gql`
  type Query {
    hello: String
  }
`

//resolver for function for schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
}

//server
const app = express()
const server = new ApolloServer({ typeDefs, resolvers })

// Express Middlewares
app.use(cors())

const port = process.env.PORT || 4000

//server needs to started before applying middlewares
server.start().then(() => {
  //Apollo server middlewares
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`App runing at http://localhost:${port}${server.graphqlPath}`)
  })
})
