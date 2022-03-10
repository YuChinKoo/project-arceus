const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { verify } = require('jsonwebtoken');

require('dotenv').config();

const getTokenData = accessToken => {
    try {
        if (accessToken) {
            return verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
};

async function startServer() {
    
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => { 
            const accessToken = req.cookies['access-token'];
            const data = getTokenData(accessToken);
            req.userId = (data) ? data.userId : null;
            console.log("requested by: " + req.userId);
            return {
                req, 
                res
            } 
        }
    });
    
    await apolloServer.start();
    
    const app = express();

    app.use(cookieParser());
    
    apolloServer.applyMiddleware({ 
        app: app,
        cors: {
            origin: 'https://studio.apollographql.com',
            credentials: true,
        }, 
    });
    
    app.use((req, res) => {
        res.send("Hello from express apollo server");
    });

    await mongoose.connect(process.env.URI);
    console.log('Mongoose connected...');

    app.listen(4000, () => console.log("Server is running on port 4000"));
}
startServer();