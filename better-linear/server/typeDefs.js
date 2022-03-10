const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID
        firstname: String
        lastname: String
        email: String
    }

    type Query {
        hello: String
        getAllUsers: [User]
        getUser(id: ID): User
    }

    input UserInput {
        firstname: String 
        lastname: String 
        email: String 
        password: String
    }

    type Mutation {
        createUser(user: UserInput): User
        deleteUser(id: ID): String
        updateUser(id: ID, firstname: String, lastname: String): User
    }
`
module.exports = typeDefs;