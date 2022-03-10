const User = require('./models/User.model');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

require('dotenv').config();

const resolvers = {
    Query: {
        getAllUsers: async () => {
            const users = await User.find();
            return users;
        },
        getUser: async (parent, {id}, context, info) => {
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
            const user = new User({ firstname, lastname, email, hashedPassword});
            await user.save();
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            const { id } = args;
            await User.findByIdAndDelete(id);
            return 'User account has been deleted';
        },
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
            console.log(user);
            if (!user) {
                throw new Error("Username not found");
            }
            
            const validatePassword = await bcrypt.compare(password, user.hashedPassword);
            if (!validatePassword) {
                throw new Error("Wrong Password");
            }
            
            // jwt stuff
            const refreshToken = sign(
                { userId: user.id}, 
                process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: "7d"
                }
            );

            const accessToken = sign(
                { userId: user.id }, 
                process.env.ACCESS_TOKEN_SECRET, { 
                    expiresIn: "30min"
                }
            );

            res.cookie("refresh-token", refreshToken, { maxAge: 60*60*24*7*1000, SameSite: "None", Secure: true });
            res.cookie("access-token", accessToken, { maxAge: 60*30*1000, SameSite: "None", Secure: true });

            return user;

        }
    },
};

module.exports = resolvers;