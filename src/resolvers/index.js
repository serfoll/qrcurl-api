const { GraphQLDateTime } = require('graphql-scalars')
const Query = require('./query')
const Mutation = require('./mutation')

module.exports = {
  DateTime: GraphQLDateTime,
  Query,
  Mutation
}
