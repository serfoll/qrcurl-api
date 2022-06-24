// Third parties module imports
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const { createComplexityLimitRule } = require('graphql-validation-complexity')
const depthLimit = require('graphql-depth-limit')
const express = require('express')
const helmet = require('helmet')
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

server.start().then(() => {
  //Apollo server middlewares
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`App runing at http://localhost:${port}${server.graphqlPath}`)
  })
})
