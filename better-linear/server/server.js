const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { verify } = require('jsonwebtoken');


require('dotenv').config();

async function startServer() {
    
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res })
    });
    
    await apolloServer.start();
    
    const app = express();

    app.use(cookieParser());

    app.use((req, res, next) =>{
        const accessToken = req.cookies['access-token'];
        try {
            const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.userId = data.userId;
            console.log(req.userId);
        } catch {
            
        }
        next();
    });
    
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