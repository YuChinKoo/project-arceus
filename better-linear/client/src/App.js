import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignInSide from './components/SignInSide';
import SignUpSide from './components/SignUpSide';
import Homepage from './components/Homepage';
import './App.css';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from './components/LoadingIcon';
import Board from './components/Board/Board';

const GET_CONTEXT = gql`
  query {
    me {
      _id
      firstname
      lastname
      email
    }
  }
`
function App() {

  const { loading, error, data } = useQuery(GET_CONTEXT);
  if (loading) return (<LoadingIcon />)
  if (error) return `Error! ${error.message}`;

  if (data.me) {
    // Client with valid auth token  
    return (
      <div>
        <div className="app center w85">
          <div style={{marginBottom: "5px"}}>
            <Header style={{marginBottom: "5px"}} authorization={true} userData={data.me}/>
          </div>
        </div>
        <Routes>
              <Route path={"/"} element={<Homepage userData={data.me}/>}/>
              <Route path={"/homepage/*"} element={<Homepage userData={data.me}/>}/>
              <Route path={"/taskboard/:id"} element={<Board />}/>
        </Routes>
      </div>
    ); 
    
  } else {
    // No/invalid auth token
    return (
      <div className="app center w85">
        <Header authorization={false} />
        <div className="ph3 pv1 background-gray">
          <Routes>
            <Route 
              path="/" 
              element={<SignInSide />} 
            />
            <Route 
              path="/signin" 
              element={<SignInSide />} 
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
