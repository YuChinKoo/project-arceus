import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from "graphql-ws";
import './index.css';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from '@apollo/client/utilities';
import { dotenv } from 'dotenv'

const env = dotenv.config();


// https://www.apollographql.com/docs/react/networking/authentication/
const httpLink = new HttpLink({
  uri: process.env.HTTP_URI,
  credentials: 'include',
});


const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.WS_URL,
    options: {
      reconnect: true,
    }
  })
);

const link = split(
  ({ query }) => {
    const allInfo = getMainDefinition(query);
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
  credentials: 'include',
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);