const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID
        firstname: String
        lastname: String
        email: String
    }

    type Query {
        getAllUsers: [User]
        getUser(id: ID): User
        me: User
    }

    input UserSignupInput {
        firstname: String!
        lastname: String!
        email: String! 
        password: String!
    }

    input UserLoginInput {
        email: String!
        password: String!
    }

    type Mutation {
        createUser(user: UserSignupInput): User!
        deleteUser(id: ID): String
        updateUser(id: ID, firstname: String, lastname: String): User
        loginUser(user: UserLoginInput): User!
    }
`
module.exports = typeDefs;