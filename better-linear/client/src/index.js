import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Board from './components/Board/Board'

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
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