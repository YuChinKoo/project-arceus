const User = require('./models/User.model');

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
            const {firstname, lastname, email, password} = args.user;
            const user = new User({ firstname, lastname, email, password });
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
        }
    },
};

module.exports = resolvers;