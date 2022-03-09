import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache  } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import GettingGraphQLDataExample from "./components/GettingGraphQLDataExample";
import SignInSide from './components/SignInSide';
import SignUpSide from './components/SignUpSide';

const client = new ApolloClient({
	uri: "http://localhost:3001/task_board",
  cache: new InMemoryCache(), 
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
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);