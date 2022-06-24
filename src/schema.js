const { gql } = require('apollo-server-express')

// GraphQL Schemas
module.exports = gql`
  scalar DateTime

  type Mutation {
    newQRCode(
      description: String
      hexCode: String!
      title: String
      url: String!
    ): QRCode!
    updateQRCode(
      id: ID!
      description: String
      title: String!
      url: String!
    ): QRCode!
    deleteQRCode(id: ID!): Boolean!
  }

  type QRCode {
    author: ID!
    createdAt: DateTime!
    description: String
    hexCode: String!
    id: ID!
    shortCode: String!
    svgCode: String!
    title: String
    updatedAt: DateTime!
    url: String!
  }

  type qrcodeFeed {
    qrcodes: [QRCode]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type Query {
    qrcodes: [QRCode!]!
    qrcode(shortCode: String!): QRCode!
    qrcodeFeed(cursor: String): qrcodeFeed
  }
`
