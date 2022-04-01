const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        firstname: String
        lastname: String
        email: String
        requestedTaskBoards: [ ID ]
        sharedTaskBoards: [ ID ]
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

    type RequestedTaskBoard {
        _id: ID
        name: String
        owner: String
    }

    type Taskboard {
        _id: ID
        name: String
        owner: String
        helpers: [String]
        requestedHelpers: [String]
        columns: [Column]
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

    type Helper {
        _id: ID
        firstname: String
        lastname: String
        email: String
    }

    type Query {
        me: User
        getMyTaskBoards: [Taskboard]
        getTaskBoardById(taskBoardId: ID!): Taskboard
        getRequestedTaskBoards: [RequestedTaskBoard]
        getSharedTaskBoards: [Taskboard]
        getTaskBoardHelpers(taskBoardId: ID!): [Helper]
        getTaskBoardRequestedHelpers(taskBoardId: ID!): [Helper]
    }

    type Mutation {
        # Account
        createUser(user: UserSignupInput!): User!
        updateUser(id: ID!, firstname: String!, lastname: String!): User
        # Authentication
        loginUser(user: UserLoginInput!): User!
        logoutUser(id: ID!): String
        # Basic Taskboard functionality
        createTaskBoard(taskBoardName: String!): Taskboard
        createTaskBoardColumn(taskBoardId: ID!, columnName: String!): Taskboard
        createTaskBoardTask(taskBoardId: ID!, columnId: ID!, taskName: String!, taskContent: String!): Taskboard
        deleteTaskBoard(taskBoardId: ID!): String
        deleteTaskBoardColumn(taskBoardId: ID!, columnId: ID!): Taskboard
        deleteTaskBoardTask(taskBoardId: ID!, columnId: ID!, taskId: ID!): Taskboard
        updateTaskBoardTaskLocation(taskBoardId: ID!, s_columnId: ID!, s_taskId: ID!, t_columnId: ID!, t_taskId: ID!): Taskboard
        updateTaskBoardTaskInfo(taskBoardId: ID!, columnId: ID!, taskId: ID!, taskName: String!, taskContent: String!): Taskboard
        # Additional taskboard functionality
        requestTaskBoardHelper(taskBoardId: ID!, helperEmail: String!): String
        # "accept" to accept, "deny" to deny
        respondTaskBoardHelperRequest(taskBoardId: ID!, response: String!): String
        removeSharedTaskBoard(taskBoardId: ID!): String
        removeTaskBoardHelper(taskBoardId: ID!, helperId: ID!): String 
        removeTaskBoardHelperRequest(taskBoardId: ID!, requestedHelperId: ID!): String 
    }

    type Subscription {
        taskBoardModified(taskBoardOwnerEmail: String!): [Taskboard]
        taskBoardRequestModified(requestUserId: ID!): [RequestedTaskBoard]
        sharedTaskBoardModified(sharedHelperId: ID!): [Taskboard]
        taskBoardContentModified(taskBoardId: ID!): Taskboard
        taskBoardHelpersModified(taskBoardId: ID!): [Helper]
        taskBoardRequestersModified(taskBoardId: ID!): [Helper]
    }
`
module.exports = typeDefs;