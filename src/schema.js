const { gql } = require('apollo-server-express')

// GraphQL Schemas
module.exports = gql`
  scalar DateTime

  type Query {
    qrcodes: [QRCode!]!
    qrcode(shortCode: String!): QRCode!
  }

  type QRCode {
    author: ID!
    createdAt: DateTime!
    description: String
    id: ID!
    shortCode: String!
    svgCode: String!
    title: String
    updatedAt: DateTime!
    url: String!
  }
  type Mutation {
    newQRCode(description: String, title: String, url: String!): QRCode!
    updateQRCode(
      id: ID!
      description: String
      title: String!
      url: String!
    ): QRCode!
    deleteQRCode(id: ID!): Boolean!
  }
`
