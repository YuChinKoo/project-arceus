const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        firstname: String
        lastname: String
        email: String
    }

    type Task {
        _id: ID,
        taskTitle: String,
        content: String
    }

    type Column {
        _id: ID,
        columnTitle: String,
        tasks: [Task]
    }

    type Taskboard {
        _id: ID
        name: String
        owner: String
        helpers: [String]
        columns: [Column]
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
        # deleteUser(id: ID): String
        updateUser(id: ID, firstname: String, lastname: String): User
        loginUser(user: UserLoginInput): User!
        createTaskBoard(taskBoardName: String): Taskboard
        createTaskBoardColumn(taskBoardId: ID, columnName: String): Taskboard
        createTaskBoardTask(taskBoardId: ID, columnId: ID, taskName: String, taskContent: String): Taskboard
        deleteTaskBoardColumn(taskBoardId: ID, columnId: ID): Taskboard
        deleteTaskBoardTask(taskBoardId: ID, columnId: ID, taskId: ID): Taskboard
    }
`
module.exports = typeDefs;