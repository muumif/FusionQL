export const typeDefs = `
scalar File

type User {
      email: String!
      name: String
}

type Query {
      allUsers: [User!]!
}

`