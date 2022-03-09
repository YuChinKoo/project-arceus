const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema');
const app = express();
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server');

mongoose
    .connect(`${process.env.uri}`)
    .then(() => {
        console.log("Connected to database...")
    })
    .catch(err => {
        console.error(err)
    });


app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));


app.listen(3001, () => {
    console.log('Server is running at port 3001')
});