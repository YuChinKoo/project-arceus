import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from "graphql-ws";
import './index.css';
// import { WebSocketLink } from '@apollo/client/link/ws';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});


const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    options: {
      reconnect: true,
    }
  })
);

const link = split(
  ({ query }) => {
    const allInfo = getMainDefinition(query);
    console.log(allInfo);
    console.log(allInfo.kind);
    console.log(allInfo.operation);
    return (
      allInfo.kind === 'OperationDefinition' &&
      allInfo.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
	link: link,
  cache: new InMemoryCache(), 
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);