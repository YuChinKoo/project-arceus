const User = require('./models/User.model');
const bcrypt = require('bcrypt');

const resolvers = {
    Query: {
        getAllUsers: async () => {
            const users = await User.find();
            return users;
        },
        getUser: async (parent, {id}, context, info) => {
            return await User.findById(id);
        },
    },
    Mutation: {
        createUser: async (parent, args, context, info) => {
            // check if args exist
            const {firstname, lastname, email, password} = args.user;
            hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ firstname, lastname, email, hashedPassword });
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
        loginUser: async (parent, args, context, info) => {
            const { email, password } = args.user;
            const user = await User.findOne({email});
            if (!user) {
                throw new Error("No User Found");
            }

            const validatePassword = await bcrypt.compare(password, user.hashedPassword);
            if (!validatePassword) {
                throw new Error("Wrong Password");
            }

            // jwt stuff?
            // return token; // this is a string, make sure to change the typedef return type
            return user;

        }
    },
};

module.exports = resolvers;