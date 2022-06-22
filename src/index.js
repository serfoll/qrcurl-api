// Third parties imports
require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')
const QRCode = require('qrcode-svg')

//project imports
const db = require('./db')
const generateShortCode = require('./generateShortCode')

let qrcodes = [
  {
    id: '1',
    url: 'google.com',
    svgCode: '<svg>1</svg>',
    shortCode: 'cklao',
    title: 'Yessir',
    description: 'first description'
  },
  {
    id: '2',
    url: 'youtube.com',
    svgCode: '<svg>2</svg>',
    shortCode: 'asdja',
    title: 'Sit',
    description: 'amet'
  },
  {
    id: '3',
    url: 'github.com',
    svgCode: '<svg>3</svg>',
    shortCode: 'asaf',
    title: 'orem d',
    description: 'Ipsum'
  }
]

//basic schema, using GraphQL
const typeDefs = gql`
  type Query {
    qrcodes: [QRCode!]!
    qrcode(shortCode: String!): QRCode!
  }

  type QRCode {
    id: ID!
    url: String!
    svgCode: String!
    shortCode: String!
    title: String!
    description: String
  }
  type Mutation {
    newQRCode(url: String!): QRCode!
  }
`

//resolver for function for schema fields
//parameters to resolver functions: (parent, args context, info)
const resolvers = {
  Query: {
    qrcodes: () => qrcodes,
    qrcode: (parent, args) => {
      return qrcodes.find(qrcode => qrcode.shortCode === args.shortCode)
    }
  },
  Mutation: {
    newQRCode: (parent, args) => {
      let url = args.url

      let qr = new QRCode({
        background: '#ffffff',
        color: '#000000',
        container: 'svg-viewbox',
        content: url,
        ecl: 'Q',
        height: 60,
        join: true,
        padding: 0,
        pretty: true,
        width: 60
      })

      let qrcodeValue = {
        description: 'Solo links',
        id: String(qrcodes.length + 1),
        shortCode: generateShortCode(6),
        svgCode: qr.svg(),
        title: 'Solo',
        url: url
      }

      qrcodes.push(qrcodeValue)
      return qrcodeValue
    }
  }
}

//connect to db
const DB_HOST = process.env.DB_HOST
db.connect(DB_HOST)

//express and apollo server server
const app = express()
const port = process.env.PORT || 4000
const server = new ApolloServer({ typeDefs, resolvers })

// Express Middlewares
app.use(cors())

server.start().then(() => {
  //Apollo server middlewares
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`App runing at http://localhost:${port}${server.graphqlPath}`)
  })
})
