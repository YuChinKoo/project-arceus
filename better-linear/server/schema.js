const graphql = require('graphql')
const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema
} = graphql;

const User = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: GraphQLString },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: GraphQLList(User),
            resolve (parentValue, args) {
                // something goes here
                return 'Hello, Graphql!'
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        signUp: {
            type: User, 
            args: {
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve (parentValue, args) {
                return "something goes here"
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery
});