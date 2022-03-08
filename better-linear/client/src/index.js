import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ApolloClient, InMemoryCache  } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import GettingGraphQLData from "./components/GettingGraphQLData";

const client = new ApolloClient({
	uri: "http://localhost:3001/task_board",
  cache: new InMemoryCache(), 
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <GettingGraphQLData />
  </ApolloProvider>,
  document.getElementById('root')
);