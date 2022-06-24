// Third parties module imports
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//local module imports
const db = require('./db')
const models = require('./models')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

//connect to db
const DB_HOST = process.env.DB_HOST
db.connect(DB_HOST)

//express and apollo server server
const app = express()
const port = process.env.PORT || 4000

//
const getUser = token => {
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
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization
    const user = getUser(token)

    console.log(user)

    return { models, user }
  }
})

// Express Middlewares
app.use(cors())

server.start().then(() => {
  //Apollo server middlewares
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`App runing at http://localhost:${port}${server.graphqlPath}`)
  })
})
