const { gql } = require('apollo-server-express')

// GraphQL Schemas
module.exports = gql`
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
