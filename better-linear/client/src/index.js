import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache  } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import Board from "./components/Board/Board";
import './index.css';

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(), 
  credentials: 'include'
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);