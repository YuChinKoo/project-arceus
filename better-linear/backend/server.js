import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from '../data/resolvers.graphql';
import { typeDefs } from '../data/schema.graphql';

const port = 5000;
const server = new ApolloServer({typeDefs, resolvers});
const app = express();
server.applyMiddleware({app});

app.get('/', (req, res) => {
  console.log("Apollo GraphQL Express server is ready");
});

app.listen({port}, () => {
  console.log(`Server is running at http://localhost:5000${server.graphqlPath}`);
});


// let { graphqlHTTP } = require('express-graphql');
// let cors = require("cors");
// let { buildSchema } = require('graphql');

// let schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// let root = {
//     hello: () => {
//       return 'Hello world!';
//     },
// };

// let app = express();
// app.use(cors());
// const port = 5000

// app.use('/graphql', graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
// }));
// app.listen(5000);
// console.log('Running a GraphQL API server at http://localhost:5000/graphql');

// app.get('/', (req, res) => {
//     res.send('Hello world!');
// });

// app.listen(port, () => {
//     console.log(`example app listening on port ${port}`);
// });