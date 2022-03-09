import React from 'react';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import SignInSide from './components/SignInSide';
import SignUpSide from './components/SignUpSide';
import './App.css';

function App() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Routes>
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

export default App;
