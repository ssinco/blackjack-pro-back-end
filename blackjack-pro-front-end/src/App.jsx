/* =======================================================
Imports
=======================================================*/

import { useState, createContext,useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css'


import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Dashboard from './components/Dashboard/Dashboard';

import * as authService from '../src/services/authService'

export const AuthedUserContext = createContext(null);





/* =======================================================
Helper Functions
=======================================================*/


/* =======================================================
Component
=======================================================*/


function App() {
  /*--------------- States/Hooks ---------------*/

  const [user, setUser] = useState(authService.getUser()); // using the method from authservice

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  useEffect(() => {
    console.log('App user state:', user);
  }, [user]);
  
  // const navigate = useNavigate();



  /*--------------- Return ---------------*/

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout}/>
        <div className="appContainer">
          {/* <AuthedUserContext.Provider> */}
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>

            </Routes>
          {/* </AuthedUserContext.Provider> */}
        </div>
      </AuthedUserContext.Provider>
    </>
  )
}

export default App
