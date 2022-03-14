const User = require('./models/User.model');
const { TaskBoard, Column, Task } = require('./models/Taskboard.model');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

require('dotenv').config();

// everytime a request is made, outside of creating a user, need 
// to confirm if the userId that is stored within the req (req.userId)
// which was originally stored in the access token does exist in the db
// Maybe not required if users cannot be deleted?
// const userExists = async (userId) => {
//     return User.findById(userId);
// };

const resolvers = {
    Query: {
        getAllUsers: async (parent, args, context, info) => {
            if (!context.req.userId) throw new Error("Unauthorized");
            const users = await User.find();
            return users;
        },
        getUser: async (parent, {id}, context, info) => {
            if (!context.req.userId) throw new Error("Unauthorized");
            return await User.findById(id);
        },
        me: async (parent, args, context, info) => {
            const { req } = context;
            if (!req.userId) {
                return null;
                // throw new Error("You are not logged in!");
            } 
            return User.findOne({_id: req.userId});
        }
    },

    Mutation: {
        createUser: async (parent, args, context, info) => {
            // check if args exist
            const {firstname, lastname, email, password} = args.user;
            hashedPassword = await bcrypt.hash(password, 10);
            const findExistingUser = await User.findOne({email});
            if (findExistingUser) {
                throw new Error('Email already exists');
            }
            const user = new User({ firstname, lastname, email, hashedPassword});
            await user.save();
            return user;
        },
        // deleteUser: async (parent, args, context, info) => {
        //     const { id } = args;
        //     await User.findByIdAndDelete(id);
        //     return 'User account has been deleted';
        // },
        updateUser: async (parent, args, context, info) => {
            const { id, firstname, lastname } = args;
            const user = await User.findByIdAndUpdate(
                id, 
                {firstname, lastname}, 
                {new: true}
            );
            return user;
        },
        loginUser: async (parent, args, { res }, info) => {
            const { email, password } = args.user;
            const user = await User.findOne({email});
            if (!user) {
                throw new Error("Username not found");
            }
            
            const validatePassword = await bcrypt.compare(password, user.hashedPassword);
            if (!validatePassword) {
                throw new Error("Wrong Password");
            }
            // jwt stuff
            const accessToken = sign(
                { userId: user.id }, 
                process.env.ACCESS_TOKEN_SECRET, { 
                    expiresIn: "1d"
                }
            );
            res.cookie("access-token", accessToken, { 
                maxAge: 1000*60*60*24, //one day 
                sameSite: "none", 
                secure: true 
            });
            return user;
        },
        createTaskBoard: async (parent, args, context, info) => {
            if (!context.req.userId) throw new Error("Unauthorized");
            const { taskBoardName } = args;
            const user = await User.findById(context.req.userId);
            const taskboard = new TaskBoard({ owner: user.email, name: taskBoardName });
            await taskboard.save();
            return taskboard;
        },
        createTaskBoardColumn: async (parent, args, context, info) => {
            if (!context.req.userId) throw new Error("Unauthorized");
            const { taskBoardId, columnName } = args;
            const taskBoard = await TaskBoard.findById(taskBoardId);
            // check if the logged in user is the owner of the taskboard
            if (!taskBoard) throw new Error("Taskboard does not exist");
            const user = await User.findById(context.req.userId);
            // if (!user) throw new Error("User does not exist");
            if (user.email != taskBoard.owner) throw new Error("Unauthorized: Not your taskboard");
            const column = new Column({ columnTitle: columnName });
            const updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id: taskBoardId },
                { $push: {columns: column} },
                { new: true }
            );
            return updatedTaskBoard;
        }, 
        createTaskBoardTask: async (parent, args, context, info) => {
            if (!context.req.userId) throw new Error("Unauthorized");
            const { taskBoardId, columnId, taskName, taskContent } = args;
            const taskBoard = await TaskBoard.findById(taskBoardId);
            if (!taskBoard) throw new Error("Taskboard does not exist");
            // check if the logged in user is the owner of the task board
            const user = await User.findById(context.req.userId);
            if (user.email != taskBoard.owner) throw new Error("Unauthorized: Not your taskboard");
            // check if the id of the column is in the taskboard
            let flag = false;
            for (const column of taskBoard.columns) {
                if (column._id == columnId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) throw new Error("Column does not exist"); 
            const newTask = new Task({ taskTitle: taskName, content: taskContent });
            
            const updatedTaskBoard = await TaskBoard.findByIdAndUpdate(
                { _id : taskBoardId }, 
                { $push: { "columns.$[column].tasks": newTask }}, 
                { 
                    arrayFilters: [ {"column._id": columnId} ],
                    new: true,
                    lean: true
                }
            ).catch(function(err) {
                throw new Error(err)
            })
            return updatedTaskBoard;
        },
    },
};

module.exports = resolvers;

// createTaskBoardTask(taskBoardId: ID, columnId: ID, taskName: String, taskContent: String): Taskboard