const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// Subscription functionality imports
const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
// Sessions
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
// Environment variables
const dotenv = require('dotenv').config();

// const getTokenData = accessToken => {
//     try {
//         if (accessToken) {
//             return verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
//         } else {
//             return null;
//         }
//     } catch (err) {
//         return null;
//     }
// };

async function startServer() {
    
    const schema = makeExecutableSchema({ 
        typeDefs, 
        resolvers
    });
    
    const app = express();
    app.use(cors({ origin: true, credentials: true }));
    app.use(cookieParser());
    app.use(session({
        enid: (req) => uuidv4(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            // sameSite: 'none',
            // sameSite: (process.env.NODE_ENV === 'production') ? 'strict' : 'none',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, //1 day
        }
    }));
    // logging purposes
    app.use(
        "/graphql",
        bodyParser.json(),
        (req, _, next) => {
            req.userId = ('userId' in req.session) ? req.session.userId : '';
            return next();
        },
    )

    const httpServer = createServer(app);

    // Creating the WebSocket server
    const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if your ApolloServer serves at a different path.
        path: '/graphql',
    });

    // Hand in the schema we just created and have the WebSocketServer start listening.
    const serverCleanup = useServer(
        { 
            schema,
            context: (ctx, msg, args) => {
                // uncomment the following and see 
                // that there is a cookie field at the bottom
                // not sure how to access it though
                // console.log(ctx.extra.request);
                return { params: ctx };
            },
            onConnect: async (ctx) => {
                console.log("Connected!");
            },
            onDisconnect(ctx, code, reason) {
                console.log('Disconnected!');
            },
        }, 
        wsServer
    );

    // Setting up the Apollo Server
    const apolloServer = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
        context: ({ req, res }) => { 
            // const accessToken = req.cookies['access-token'];
            // const data = getTokenData(accessToken);
            // req.userId = (data) ? data.userId : null;
            // req.token = data;
            console.log("requested by: " + req.userId);
            return {
                req, 
                res
            } 
        }
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({ 
        app: app,
        cors: {
            origin: ['http://localhost:3000/*', 'https://studio.apollographql.com/*'],
            credentials: true,
        }, 
    });

    await mongoose.connect(process.env.URI);
    console.log('Mongoose connected...');

    httpServer.listen(4000, () => {
        console.log("Server is running on port 4000");
    });
}

startServer();