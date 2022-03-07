var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
    hello: () => {
      return 'Hello world!';
    },
};

var app = express();
const port = 5000

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(5000);
console.log('Running a GraphQL API server at http://localhost:5000/graphql');

// app.get('/', (req, res) => {
//     res.send('Hello world!');
// });

// app.listen(port, () => {
//     console.log(`example app listening on port ${port}`);
// });