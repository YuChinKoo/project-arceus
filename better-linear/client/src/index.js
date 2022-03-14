import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache  } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import GettingGraphQLDataExample from "./components/GettingGraphQLDataExample";
import SignInSide from './components/SignInSide';
import SignUpSide from './components/SignUpSide';
import Homepage from './components/Homepage';
import Taskmainpage from './components/Taskmainpage';

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(), 
  credentials: 'include'
});

// Basic query to get database data and display
// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <GettingGraphQLDataExample />
//   </ApolloProvider>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Taskmainpage/>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);