const User = require('./models/User.model');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { TaskBoard, Column, Task} = require('./models/Taskboard.model');
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
        getTaskBoardById: async(parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            }); 
            let { taskBoardId } = args;
            console.log(taskBoardId);
            const taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err){
                throw new Error(err)
            });
            let flag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    flag = true;
                    break;
                }
            }

            if(!flag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");

            console.log(taskBoard);
            return taskBoard;
        },
        getRequestedTaskBoards: async(parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            }); 

            let queryArray = [];
            for(let requestedBoardId of user.requestedTaskBoards){
                queryArray.push({ '_id': requestedBoardId })
            };
            let allRequestedBoards = null;
            if(queryArray.length) {
                allRequestedBoards = TaskBoard.find({
                    $or: queryArray
                })
                .catch(function(err) {
                    throw new Error(err)
                }); 
            }
            return allRequestedBoards;
        },
        getSharedTaskBoards: async(parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            }); 

            let queryArray = [];
            for(let sharedBoardId of user.sharedTaskBoards){
                queryArray.push({ '_id': sharedBoardId })
            };
            let allSharedBoards = null;
            if(queryArray.length) {
                allSharedBoards = TaskBoard.find({
                    $or: queryArray
                })
                .catch(function(err) {
                    throw new Error(err)
                }); 
            }
            return allSharedBoards;
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
            const myTaskBoards = await TaskBoard.find({ owner: user.email })
            .catch(function(err) {
                throw new Error(err)
            }); 
            pubsub.publish('TASKBOARD_MODIFIED', { modifiedBoard: taskboard, myTaskBoards: myTaskBoards }); 
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
            pubsub.publish('TASKBOARD_COLUMN_CREATED', { modifiedBoard: updatedTaskBoard }); 
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
            // remove taskboard from all helpers
            let taskBoardHelpers = taskBoard.helpers;
            for(let helperId in taskBoardHelpers){
                let updatedHelper = await User.findByIdAndUpdate(
                    { _id: helperId },
                    { $pull: {sharedTaskBoards: taskBoardId} },
                    { new: true })
                .catch(function(err) {
                    throw new Error(err)
                });
            };
            // remove taskboard from all requested helpers
            let requestedTaskBoardHelpers = taskBoard.requestedHelpers;
            for(let requestedHelperId in requestedTaskBoardHelpers){
                let updatedRequestedHelper = await User.findByIdAndUpdate(
                    { _id: requestedHelperId },
                    { $pull: {requestedTaskBoards: taskBoardId} },
                    { new: true })
                .catch(function(err) {
                    throw new Error(err)
                });
            };

            //delete the requested taskboard
            await TaskBoard.deleteOne({_id: taskBoardId})
            .catch(function(err) {
                throw new Error(err)
            });
            const myTaskBoards = await TaskBoard.find({ owner: user.email })
            .catch(function(err) {
                throw new Error(err)
            }); 
            pubsub.publish('TASKBOARD_MODIFIED', { modifiedBoard: taskBoard, myTaskBoards: myTaskBoards }); 
            // pubsub.publish('SHARED_TASKBOARD_MODIFIED', { modifiedBoard: taskBoard, helpers: taskBoard.helpers });
            // pubsub.publish('REQUESTED_TASKBOARD_MODIFIED', { modifiedBoard: taskBoard, helpers: taskBoard.helpers });
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
        },
        requestTaskBoardHelper: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const { taskBoardId, helperEmail } = args;
            // check if the taskboard exists
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (!taskBoard) throw new Error("Taskboard does not exist");
            // check if the requested helper exists
            let helper = await User.findOne({email: helperEmail})
            .catch(function(err) {
                throw new Error(err)
            });
            if (!helper) throw new Error("Helper email does not exist");
            // check if the logged in user is the owner of the taskboard
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (user.email != taskBoard.owner) throw new Error("Unauthorized to add helpers this taskboard");

            if (helperEmail == user.email) throw new Error("Cannot add yourself as a helper");

            for (let id of helper.requestedTaskBoards) {
                if (taskBoardId == id) throw new Error("Request still pending");
            }
            for (let id of helper.sharedTaskBoards) {
                if (taskBoardId == id) throw new Error("Already shared");
            }

            // add taskboard to helpers requestedTaskBoards array
            let updatedHelper = await User.findByIdAndUpdate(
                { _id: helper._id },
                { $push: {requestedTaskBoards: taskBoardId} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            // add helper to taskboards requestedHelpers array
            let updatedTaskBoard = TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $push: {requestedHelpers: helper._id} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });

            // publish subscription data
            pubsub.publish('TASKBOARD_HELPER_REQUEST_MODIFIED', { modifiedBoard: taskBoard, helperTaskBoards: helper.requestedTaskBoards }); 

            return "Request sent";
        },
        respondTaskBoardHelperRequest: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const { taskBoardId, response } = args;
            // check if valid response
            if ((response != "accept") && (response != "deny")) throw new Error("Invalid response, must be accept or deny");
            // check if taskboard exists
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (!taskBoard) throw new Error("Taskboard does not exist");
            //check if the taskboard is in the accept sender's user object
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            let flag = false;
            for(let requestedBoard of user.requestedTaskBoards) {
                if (requestedBoard == taskBoardId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) throw new Error("The owner of the taskboard has not requested you to help");
            
            // remove board from user's requestedTaskBoards array
            let updatedHelper = await User.findByIdAndUpdate(
                { _id: user._id },
                { $pull: {requestedTaskBoards: taskBoardId} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            // remove helper from taskboard's requestedHelpers array
            let updatedTaskBoard = TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $pull: {requestedHelpers: user._id} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            if (response == "accept") {
                // add board to user's sharedTaskBoards array
                updatedHelper = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $push: {sharedTaskBoards: taskBoardId} },
                    { new: true })
                .catch(function(err) {
                    throw new Error(err)
                });

                // add helper to taskboards helper array
                updatedTaskBoard = TaskBoard.findByIdAndUpdate(
                    { _id: taskBoardId },
                    { $push: {helpers: user._id} },
                    { new: true })
                .catch(function(err) {
                    throw new Error(err)
                });
                // publish subscription data for removing a requested taskboard
                // publish subscription data for adding a shared taskboard
                return "Request accepted";
            } else {
                // publish subscription data for removing a requested taskboard
                return "Request deny";
            }
        },
        removeSharedTaskBoard: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const { taskBoardId } = args;
            // check if taskboard exists
            let taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err) {
                throw new Error(err)
            });
            if (!taskBoard) throw new Error("Taskboard does not exist");
            // check if user is a helper to the taskboard
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });

            let flag = false;
            for(let helperId of taskBoard.helpers){
                if(user._id == helperId){
                    flag = true;
                    break;
                }
            }
            if(!flag) throw new Error("You are not a helper of this taskboard");
            // Remove taskboard from users shared taskboard array
            user = await User.findByIdAndUpdate(
                { _id: user._id },
                { $pull: {sharedTaskBoards: taskBoardId} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            // publish subscription data for removing a shared taskboard 

            // remove user from taskboards helper array
            taskBoard = TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $pull: {helpers: user._id} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            return "Taskboard no longer shared with you"

        },
    },

    Subscription: {
        taskBoardModified: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_MODIFIED']),
                (payload, variables) => {
                    // only push an update if the created taskboard belongs to the subscriber
                    let givenBoardOwnerEmail = variables.taskBoardOwnerEmail;
                    // Change this to also notify helpers when helpers are implemented 
                    // as they should be notified when 
                    // a task board they are a helper for is deleted
                    let modifiedBoardOwnerEmail = payload.modifiedBoard.owner;
                    return (givenBoardOwnerEmail == modifiedBoardOwnerEmail);
                },
            ),
            resolve: (payload) => {
                return payload.myTaskBoards;
            },
        },
        taskBoardColumnAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_COLUMN_CREATED']),
                (payload, variables) => {
                    let givenBoardId = variables.taskBoardId;
                    let modifiedBoardId = payload.modifiedBoard._id;
                    return (givenBoardId == modifiedBoardId);
                }
            ),
            resolve: (payload) => {
                return payload.modifiedBoard;
            }
        },
        taskBoardRequestModified: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_MODIFIED']),
                (payload, variables) => {

                },
            ),
            resolve: (payload) => {
                return payload;
            },
        },
    }
};

module.exports = resolvers;