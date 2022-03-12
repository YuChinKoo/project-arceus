import React from 'react';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import SignInSide from './components/SignInSide';
import SignUpSide from './components/SignUpSide';
import Homepage from './components/Homepage';
import './App.css';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

const GET_CONTEXT = gql`
  query {
    me {
      id
      firstname
      lastname
      email
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(GET_CONTEXT);
  
  if (loading) return "loading";
  if (error) return `Error! ${error.message}`;
  if (data.me) {
    return (
      <div className="center w85">
        <Header authorization={true} />
        <Homepage/>
        <div className="ph3 pv1 background-gray">
          <Routes>
            <Route 
              path="/" 
              element={<div>hello</div>} 
            />
          </Routes>
        </div>
      </div>
    );
  } else {
    return (
      <div className="center w85">
        <Header authorization={false} />
        <div className="ph3 pv1 background-gray">
          <Routes>
            <Route 
              path="/" 
              element={<SignUpSide/>} 
            />
            <Route 
              path="/signin" 
              element={<SignInSide/>} 
            />
            <Route
              path="/signup"
              element={<SignUpSide/>}
            />
          </Routes>
        </div>
      </div>
    );
  }
  
}

export default App;
