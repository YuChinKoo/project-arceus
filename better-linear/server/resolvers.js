const User = require('./models/User.model');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { TaskBoard, Column, Task} = require('./models/Taskboard.model');
const bcrypt = require('bcrypt');
const { PubSub, withFilter } = require('graphql-subscriptions');
// Input text validation
const validator = require('validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
// Express session purposes
const cookie = require('cookie');

require('dotenv').config();

const pubsub = new PubSub();

const resolvers = {
    Query: {
        me: async (parent, args, context, info) => {
            if (!context.req.session.userId) {
                return null;
            }
            const foundUser = await User.findOne({_id: context.req.session.userId})
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
            const taskBoard = await TaskBoard.findById(taskBoardId)
            .catch(function(err){
                throw new Error(err)
            });
            if (!taskBoard) throw new Error("Taskboard does not exist");
            let flag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    flag = true;
                    break;
                }
            }
            if(!flag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");
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
            let allRequestedBoards = [];
            if(queryArray.length) {
                allRequestedBoards = await TaskBoard.find({
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
            let allSharedBoards = [];
            if(queryArray.length) {
                allSharedBoards = await TaskBoard.find({
                    $or: queryArray
                })
                .catch(function(err) {
                    throw new Error(err)
                }); 
            }
            return allSharedBoards;
        },
        getTaskBoardHelpers: async(parent, args, context, info) => {
            if(!context.req.userId) throw new AuthenticationError("Unauthorized");
            
            let { taskBoardId } = args;

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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");
            let queryArray = [];
            for(let helper of taskBoard.helpers){
                queryArray.push({ '_id': helper })
            };
            let allHelpers = [];
            if(queryArray.length) {
                allHelpers = await User.find({
                    $or: queryArray
                })
                .catch(function(err) {
                    throw new Error(err)
                }); 
            }
            return allHelpers;
        }
    },

    Mutation: {
        createUser: async (parent, args, context, info) => {
            // check if args exist
            let {firstname, lastname, email, password} = args.user;
            firstname = DOMPurify.sanitize(firstname);
            lastname = DOMPurify.sanitize(lastname);
            email = DOMPurify.sanitize(email);
            password = DOMPurify.sanitize(password);
            // check email input
            if (!validator.isEmail(email)) throw new UserInputError('Invalid email');
            if (email.length > 25) throw new UserInputError('Email must be less than 25 characters');
            // check firstname input
            if (!validator.isAlpha(firstname)) throw new UserInputError('Firstname must only use characters in the alphabet');
            if (firstname.length > 12) throw new UserInputError('Firstmame must be no longer than 12 characters');
            if (firstname.length < 1) throw new UserInputError('Firstname must be longer than 1 character');
            // check lastname input
            if (!validator.isAlpha(lastname)) throw new UserInputError('Lastname must only use characters in the alphabet');
            if (lastname.length > 12) throw new UserInputError('Lastname must be no longer than 12 characters');
            if (lastname.length < 1) throw new UserInputError('Lastname must be longer than 1 character');
            // check password input
            if (!validator.isAlphanumeric(password)) throw new UserInputError('Password must be alphanumeric');
            if (password.length > 20) throw new UserInputError('Password must be no longer than 20 character');
            if (password.length < 1) throw new UserInputError('Password must be longer than 1 character');
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
        loginUser: async (parent, args, { req, res }, info) => {
            let { email, password } = args.user;
            let user = await User.findOne({email})
            .catch(function(err) {
                throw new Error(err)
            });
            if (!user) throw new UserInputError("Username not found");
            let validatePassword = await bcrypt.compare(password, user.hashedPassword);
            if (!validatePassword) throw new UserInputError("Incorrect Password");
            req.session.userId = user.id;
            res.cookie('userId', user.id, {
                secure: process.env.NODE_ENV === 'production',
                path : '/', 
                maxAge: 60 * 60 * 24 * 1000  // 1 day in number of seconds
            });
            return user;
        },
        logoutUser: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { res } = context;
            let user = await User.findById(context.req.userId)
            .catch(function(err) {
                throw new Error(err)
            });
            context.req.session.destroy();
            res.cookie('userId', '', {
                secure: process.env.NODE_ENV === 'production',
                path : '/', 
                maxAge: 60 * 60 * 24 * 1000  // 1 day in number of seconds
            });
            return "successfully signed out";
        },
        createTaskBoard: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardName } = args;
            taskBoardName = DOMPurify.sanitize(taskBoardName);
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
            columnName = DOMPurify.sanitize(columnName);
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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");

            let column = new Column({ columnTitle: columnName });
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $push: {columns: column} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });
            pubsub.publish('TASKBOARD_CONTENT_MODIFIED', { modifiedBoard: updatedTaskBoard }); 
            return updatedTaskBoard;
        }, 
        createTaskBoardTask: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, columnId, taskName, taskContent } = args;
            taskName = DOMPurify.sanitize(taskName);
            taskContent = DOMPurify.sanitize(taskContent);
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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");

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
            pubsub.publish('TASKBOARD_CONTENT_MODIFIED', { modifiedBoard: updatedTaskBoard }); 
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
            for(let helperId of taskBoardHelpers){
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
            for(let requestedHelperId of requestedTaskBoardHelpers){
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
            // notify taskboard owner that the board has been deleted
            pubsub.publish('TASKBOARD_MODIFIED', { modifiedBoard: taskBoard, myTaskBoards: myTaskBoards }); 
            // publish sub data for all pending taskboard request users as this taskboard no longer exists
            for(let curRequestUserId of taskBoard.requestedHelpers){
                let curRequestUser = await User.findById(curRequestUserId)
                .catch(function(err) {
                    throw new Error(err)
                }); 
                pubsub.publish('TASKBOARD_HELPER_REQUEST_MODIFIED', { modifiedBoard: taskBoard, requestedHelper: curRequestUser });
            }
            // publish sub data for all helpers of this taskboard as this taskboard no longer exists
            for(let curHelperUserId of taskBoard.helpers){
                let curHelperUser = await User.findById(curHelperUserId)
                .catch(function(err) {
                    throw new Error(err)
                }); 
                pubsub.publish('TASKBOARD_HELPER_MODIFIED', { modifiedBoard: taskBoard, helper: curHelperUser });
            }
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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");
            
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
            pubsub.publish('TASKBOARD_CONTENT_MODIFIED', { modifiedBoard: updatedTaskBoard }); 
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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");

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
            pubsub.publish('TASKBOARD_CONTENT_MODIFIED', { modifiedBoard: updatedTaskBoard }); 
            return updatedTaskBoard;
        },
        updateTaskBoardTaskLocation: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, s_columnId, s_taskId, t_columnId, t_taskId } = args;
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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");

            // check if source and target column exists
            let columns = taskBoard.columns;
            let s_columnIndex = -1;
            let t_columnIndex = -1;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i]._id == s_columnId) {
                    s_columnIndex = i;
                }
                if (columns[i]._id == t_columnId) {
                    t_columnIndex = i;
                }
            }
            if (s_columnIndex < 0) throw new Error("Source Column does not exist");
            if (t_columnIndex < 0) throw new Error("Target Column does not exist");

            // remove s_task from s_column
            // if t_task is empty, simply add s_task into t_column
            // otherwise, find t_task index -1, and push s_task into t_column at that index
            
            // store task object from source column
            let task = columns[s_columnIndex].tasks.find((item) => item._id == s_taskId);
            if (!task) throw new Error("Source task does not exist in source column")

            let t_taskIndex = columns[t_columnIndex].tasks.findIndex((item) => item._id == t_taskId);
            
            // remove s_task from s_column
            await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId},
                { $pull: { "columns.$[column].tasks": {_id: s_taskId}} },
                {
                    arrayFilters: [ {"column._id": s_columnId} ],
                    new: true
                }
            ).catch(function(err) {
                throw new Error(err)
            });

            if (t_taskIndex < 0) {
                t_taskIndex = 0;
            } 

            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $push: { "columns.$[column].tasks": { $each: [task] , $position: t_taskIndex+1 } } },
                {
                    arrayFilters: [ {"column._id": t_columnId} ],
                    new: true
                }
            ).catch(function(err) {
                throw new Error(err)
            });
            pubsub.publish('TASKBOARD_CONTENT_MODIFIED', { modifiedBoard: updatedTaskBoard }); 
            return updatedTaskBoard;
        },
        updateTaskBoardTaskInfo: async (parent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            let { taskBoardId, columnId, taskId, taskName, taskContent } = args;
            taskName = DOMPurify.sanitize(taskName);
            taskContent = DOMPurify.sanitize(taskContent);
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
            // check if the logged in user is a helper for the taskboard
            let helperFlag = false;
            for(let helper of taskBoard.helpers) {
                if (helper == context.req.userId) {
                    helperFlag = true;
                    break;
                }
            }
            if(!helperFlag && (user.email != taskBoard.owner)) throw new AuthenticationError("Unauthorized");
            // check if the id of the column is in the taskboard
            let flag = false;
            for (const column of taskBoard.columns) {
                if (column._id == columnId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) throw new Error("Column does not exist"); 
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id : taskBoardId }, 
                { $set: { "columns.$[column].tasks.$[task]": {taskTitle: taskName, content: taskContent} }}, 
                { 
                    arrayFilters: [ {"column._id": columnId}, {"task._id": taskId} ],
                    new: true
                })
            .catch(function(err) {
                throw new Error(err)
            })
            pubsub.publish('TASKBOARD_CONTENT_MODIFIED', { modifiedBoard: updatedTaskBoard }); 
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
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $push: {requestedHelpers: helper._id} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });

            // publish subscription data
            pubsub.publish('TASKBOARD_HELPER_REQUEST_MODIFIED', { modifiedBoard: updatedTaskBoard, requestedHelper: updatedHelper }); 

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
            let updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
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
                updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                    { _id: taskBoardId },
                    { $push: {helpers: user._id} },
                    { new: true })
                .catch(function(err) {
                    throw new Error(err)
                });
                // publish subscription data for removing a requested taskboard
                pubsub.publish('TASKBOARD_HELPER_REQUEST_MODIFIED', { modifiedBoard: updatedTaskBoard, requestedHelper: updatedHelper }); 
                // publish subscription data for adding a shared taskboard
                pubsub.publish('TASKBOARD_HELPER_MODIFIED', { modifiedBoard: updatedTaskBoard, helper: updatedHelper });
                return "Request accepted";
            } else {
                // publish subscription data for removing a requested taskboard
                pubsub.publish('TASKBOARD_HELPER_REQUEST_MODIFIED', { modifiedBoard: updatedTaskBoard, requestedHelper: updatedHelper }); 
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
            // remove user from taskboards helper array
            taskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $pull: {helpers: user._id} },
                { new: true })
            .catch(function(err) {
                throw new Error(err)
            });

            // publish subscription data for removing a shared taskboard 
            pubsub.publish('TASKBOARD_HELPER_MODIFIED', { modifiedBoard: taskBoard, helper: user });

            return "Taskboard no longer shared with you"
        },
        removeTaskBoardHelper: async (oarent, args, context, info) => {
            if (!context.req.userId) throw new AuthenticationError("Unauthorized");
            const { taskBoardId, helperId } = args;
            return "filler";
        }
    },

    Subscription: {
        taskBoardModified: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_MODIFIED']),
                (payload, variables) => {
                    // only push an update if the created/deleted taskboard belongs to the subscriber
                    let givenBoardOwnerEmail = variables.taskBoardOwnerEmail;
                    let modifiedBoardOwnerEmail = payload.modifiedBoard.owner;
                    return (givenBoardOwnerEmail == modifiedBoardOwnerEmail);
                },
            ),
            resolve: (payload) => {
                return payload.myTaskBoards;
            },
        },
        taskBoardContentModified: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_CONTENT_MODIFIED']),
                (payload, variables) => {
                    // check user and boardId
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
                () => pubsub.asyncIterator(['TASKBOARD_HELPER_REQUEST_MODIFIED']),
                (payload, variables) => {
                    let requestedHelper = payload.requestedHelper;
                    let requestUserId = variables.requestUserId;
                    return (requestedHelper.id == requestUserId);
                },
            ),
            resolve: async (payload) => {
                let queryArray = [];
                for(let requestedBoardId of payload.requestedHelper.requestedTaskBoards){
                    queryArray.push({ '_id': requestedBoardId })
                };
                let allRequestedBoards = [];
                if(queryArray.length) {
                    allRequestedBoards = await TaskBoard.find({
                        $or: queryArray
                    })
                    .catch(function(err) {
                        throw new Error(err)
                    }); 
                }
                return allRequestedBoards;
            },
        },
        sharedTaskBoardModified: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(['TASKBOARD_HELPER_MODIFIED']),
                (payload, variables) => {
                    let sharedHelper = payload.helper;
                    let sharedHelperId = variables.sharedHelperId;
                    return (sharedHelper.id == sharedHelperId);
                },
            ),
            resolve: async (payload) => {
                let queryArray = [];
                for(let sharedBoardId of payload.helper.sharedTaskBoards){
                    queryArray.push({ '_id': sharedBoardId })
                };
                let allSharedBoards = [];
                if(queryArray.length) {
                    allSharedBoards = await TaskBoard.find({
                        $or: queryArray
                    })
                    .catch(function(err) {
                        throw new Error(err)
                    }); 
                }
                return allSharedBoards;
            },
        },
    }
};

module.exports = resolvers;