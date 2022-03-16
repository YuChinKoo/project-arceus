import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< Updated upstream
import Board from "./components/Board/Board";
import './index.css';
=======
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';


const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: "test",
    }
  }
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
})

const link = split(
  ({ query }) => {
    console.log("test");
    console.log(query);
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);
>>>>>>> Stashed changes

const client = new ApolloClient({
	link: link,
  cache: new InMemoryCache(), 
  credentials: 'include'
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Board/>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);