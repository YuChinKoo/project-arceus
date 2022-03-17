const User = require('./models/User.model');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { TaskBoard, Column, Task } = require('./models/Taskboard.model');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const validator = require('validator');
const { PubSub, withFilter } = require('graphql-subscriptions');

require('dotenv').config();

const pubsub = new PubSub();

// everytime a request is made, outside of creating a user, need 
// to confirm if the userId that is stored within the req (req.userId)
// which was originally stored in the access token does exist in the db
// Maybe not required if users cannot be deleted?
// const userExists = async (userId) => {
//     return User.findById(userId);
// };

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            const { req } = context;
            if (!req.userId) {
                return null;
            }
            const foundUser = User.findOne({_id: req.userId})
            .catch(function(err) {
                throw new Error(err)
            }); 
            return foundUser;
        },
        getUser: async (parent, {id}, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const foundUser = await User.findById(id)
            .catch(function(err) {
                throw new Error(err)
            }); 
            return foundUser;
        },
        getMyTaskBoards: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            }); 
            const myTaskBoards = await TaskBoard.find({ owner: user.email })
            .catch(function(err) {
                throw new Error(err)
            }); 
            return myTaskBoards;
        },
        getAllUsers: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const users = await User.find()
            .catch(function(err) {
                throw new Error(err)
            });
            return users;
        },
    },

    Mutation: {
        createUser: async (parent, args, context, info) => {
            // check if args exist
            let {firstname, lastname, email, password} = args.user;
            firstname = validator.escape(firstname);
            lastname = validator.escape(lastname);
            email = validator.escape(email);
            password = validator.escape(password);
            if (!validator.isEmail(email)) throw new UserInputError('Invalid email');
            if (!validator.isAlpha(firstname) || firstname.length > 12) throw new UserInputError('Invalid firstname');
            if (!validator.isAlpha(lastname) || lastname.length > 12) throw new UserInputError('Invalid lastname');
            if (!validator.isAlphanumeric(password)  || password.length > 15) throw new UserInputError('Invalid password');
            hashedPassword = await bcrypt.hash(password, 10);
            let findExistingUser = await User.findOne({email})
            .catch(function(err) {
                throw new Error(err)
            });
            if (findExistingUser) throw new UserInputError('Email already exists');
            let user = new User({ firstname, lastname, email, hashedPassword});
            await user.save();
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { id, firstname, lastname } = args;
            let user = await User.findByIdAndUpdate(
                id, 
                {firstname, lastname}, 
                {new: true}).
            catch(function(err) {
                throw new Error(err)
            });
            return user;
        },
        loginUser: async (parent, args, { res }, info) => {
            let { email, password } = args.user;
            let user = await User.findOne({email})
            .catch(function(err) {
                throw new Error(err)
            });
            if (!user) throw new UserInputError("Username not found");
            let validatePassword = await bcrypt.compare(password, user.hashedPassword);
            if (!validatePassword) throw new UserInputError("Incorrect Password");
            // jwt stuff
            let accessToken = sign(
                { userId: user.id }, 
                process.env.ACCESS_TOKEN_SECRET, { 
                    expiresIn: "1d"
                }
            );
            res.cookie("access-token", accessToken, { 
                maxAge: 1000*60*60*24, //one day 
                sameSite: "none", 
                secure: true,
                httpOnly: true
            });
            return user;
        },
        logoutUser: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { id } = args;
            let { res } = context;
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            // assign new token that expires immediately
            let accessToken = sign(
                { userId: user.id }, 
                process.env.ACCESS_TOKEN_SECRET, { 
                    expiresIn: 1
                }
            );
            res.cookie("access-token", accessToken, { 
                maxAge: 1,  
                sameSite: "none", 
                secure: true,
                httpOnly: true
            });
            return "successfully signed out";
        },
        createTaskBoard: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardName } = args;
            taskBoardName = validator.escape(taskBoardName);
            if (taskBoardName.length > 20) throw new UserInputError("Taskboard name must be less than 20 characters");
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            let taskboard = new TaskBoard({ owner: user.email, name: taskBoardName });
            await taskboard.save();
            pubsub.publish('TASKBOARD_CREATED', { taskBoardCreated: taskboard }); 
            return taskboard;
        },
        createTaskBoardColumn: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, columnName } = args;
            columnName = validator.escape(columnName);
            if (columnName.length > 20) throw new UserInputError("Taskboard column name must be less than 20 characters");
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            // check if the logged in user is the owner of the taskboard
            if (!taskBoard) throw new Error("Taskboard does not exist");
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (user.email != taskBoard.owner) throw new Error("Unauthorized: Not your taskboard");
            let column = new Column({ columnTitle: columnName });
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $push: {columns: column} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            return updatedTaskBoard;
        }, 
        createTaskBoardTask: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, columnId, taskName, taskContent } = args;
            taskName = validator.escape(taskName);
            taskContent = validator.escape(taskContent);
            if (taskName.length > 20) throw new UserInputError("Task name must be less than 20 characters");
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (!taskBoard) throw new Error("Taskboard does not exist");
            // check if the logged in user is the owner of the task board
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (user.email != taskBoard.owner) throw new Error("Unauthorized to modify this taskboard");
            // check if the id of the column is in the taskboard
            let flag = false;
            for (const column of taskBoard.columns) {
                if (column._id == columnId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) throw new Error("Column does not exist"); 
            let newTask = new Task({ taskTitle: taskName, content: taskContent });
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id : taskBoardId }, 
                { $push: { "columns.$[column].tasks": newTask }}, 
                { 
                    arrayFilters: [ {"column._id": columnId} ],
                    new: true,
                    lean: true
                })
            .catch(function(err) {
                throw new Error(err)
            })
            return updatedTaskBoard;
        },
        deleteTaskBoard: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const { taskBoardId } = args;
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            // check if the logged in user is the owner of the taskboard
            if (!taskBoard) throw new Error("Taskboard does not exist");
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (user.email != taskBoard.owner) throw new Error("Unauthorized to modify this taskboard");
            //delete the requested taskboard
            await TaskBoard.deleteOne({_id: taskBoardId})
            .catch(function(err) {
                throw new Error(err)
            });
            return "Taskboard deleted";

        },
        deleteTaskBoardColumn: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, columnId } = args;
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            // check if the logged in user is the owner of the taskboard
            if (!taskBoard) throw new Error("Taskboard does not exist");
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (user.email != taskBoard.owner) throw new Error("Unauthorized to modify this taskboard");
            
            // check if column exists
            let flag = false;
            for (const column of taskBoard.columns) {
                if (column._id == columnId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) throw new Error("Column does not exist"); 
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId},
                { $pull: { columns: {_id: columnId}} },
                { new: true }
            ).catch(function(err) {
                throw new Error(err)
            });
            return updatedTaskBoard;
        },
        deleteTaskBoardTask: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, columnId, taskId } = args;
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            // check if the logged in user is the owner of the taskboard
            if (!taskBoard) throw new Error("Taskboard does not exist");
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            // if (!user) throw new Error("User does not exist");
            if (user.email != taskBoard.owner) throw new Error("Unauthorized: Not your taskboard");
            
            // check if column exists
            let flag = false;
            for (const column of taskBoard.columns) {
                if (column._id == columnId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) throw new Error("Column does not exist"); 
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId},
                { $pull: { "columns.$[column].tasks": {_id: taskId}} },
                {
                    arrayFilters: [ {"column._id": columnId} ],
                    new: true
                }
            ).catch(function(err) {
                throw new Error(err)
            });
            return updatedTaskBoard;
        }
    },

    Subscription: {
        taskBoardCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_CREATED']),
                (payload, variables) => {
                    // only push an update if the created taskboard belongs to the subscriber
                    let givenBoardOwnerEmail = variables.taskBoardOwnerEmail;
                    let createdBoardOwnerEmail = payload.taskBoardCreated.owner;
                    return (givenBoardOwnerEmail == createdBoardOwnerEmail);
                },
            ),
        },
    }
};

module.exports = resolvers;
