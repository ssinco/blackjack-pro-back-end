/* =======================================================
Imports
=======================================================*/


import { useState, createContext,useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import * as authService from '../../services/authService'

import SigninForm from './SigninForm';
import SignupForm from './SignupForm';



/* =======================================================
Helper Functions
=======================================================*/


/* =======================================================
Component
=======================================================*/



function Home() {
    /*--------------- States/Hooks ---------------*/
  
    const [user, setUser] = useState(authService.getUser()); // using the method from authservice
    const [loginForm,setLoginForm] = useState(1)
  
    const handleFormSwap = () => {
        setLoginForm(loginForm*-1)
        console.log(loginForm)
    }
    const handleSignout = () => {
      authService.signout();
      setUser(null);
    };
    
    // const navigate = useNavigate();
  
  
  
    /*--------------- Return ---------------*/
  
    return (
      <>
        <h1>Home Page</h1>
        <div>
            {loginForm > 0 ? (
                <>
                    <SigninForm setUser={setUser} handleFormSwap={handleFormSwap}/>
                </>
            ):(
                <SignupForm setUser={setUser} handleFormSwap={handleFormSwap}/>
            )}
        </div>
      </>
    )
  }
  
  export default Home
  