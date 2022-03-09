const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLObjectType
} = require("graphql");

var app = express();
var cors = require("cors");

app.use(cors());

mongoose.connect(
    "mongodb+srv://admin:C9PRrRC1TjI3Unhv@project-arceus.8xsst.mongodb.net/task_board?retryWrites=true&w=majority"
)
.then(() => console.log("Connected to database..."))
.catch(err => console.error(err));

const PersonModel = mongoose.model("user", {
    firstname: String,
    lastname: String,
    email: String,
    password: String
});

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLID },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            // name of the query: user
            user: {
                // the type of response this query will return, here UserType
                type: GraphQLList(UserType),
                // resolver is required
                resolve: (root, args, context, info) => {
                    // we are returning all persons available in the table in mongodb
                    return PersonModel.find().exec();
                }
            }
        }
    }),
	mutation: new GraphQLObjectType({
		name: "Create",
		fields: {
			user: {
				type: UserType,
				args: {
					firstname: { type: GraphQLString },
					lastname: { type: GraphQLString },
                    email: { type: GraphQLString },
                    password: { type: GraphQLString }
				},
				resolve: (root, args, context, info) => {
					var user = new PersonModel(args);
					return user.save();
				}
			}
		}
	})
});


app.use("/task_board", graphqlHTTP({
    schema, 
    graphiql: true
}));

app.listen(3001, () => {
    console.log("server running at 3001")
});
