import React from 'react';
import Header from './components/Header/Header';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignInSide from './components/Access/SignInSide';
import SignUpSide from './components/Access/SignUpSide';
import Homepage from './components/Homepage/Homepage';
import './App.css';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import LoadingIcon from './components/Utilities/LoadingIcon';
import Board from './components/Board/Board';
import Credits from './components/Credits/Credits'

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
              <Route path={"/homepage/*"} element={<Homepage userData={data.me}/>}/>
              <Route path={"/taskboard/:id"} element={<Board />}/>
              <Route path="/credits" element={<Credits />}/>  
              <Route 
                path={"*"}
                element={<Navigate to="/homepage/my-task-boards" replace />}
              />

        </Routes>
      </div>
    ); 
    
  } else {
    // No/invalid auth token
    return (
      <div className="app center w85" style={{height: '100vh'}}>
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
            <Route 
              path="/credits"
              element={<Credits />}
            />            
          </Routes>
        </div>
      </div>
    );
  }
  
}

export default App;
