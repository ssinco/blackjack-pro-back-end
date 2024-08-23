/* =======================================================
Imports
=======================================================*/


import { useState, createContext,useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthedUserContext } from '../../App';


import * as authService from '../../services/authService'

import SigninForm from './SigninForm';
import SignupForm from './SignupForm';



/* =======================================================
Helper Functions
=======================================================*/


/* =======================================================
Component
=======================================================*/



function Home(props) {
    /*--------------- States/Hooks ---------------*/
    const [loginForm,setLoginForm] = useState(1)
    const user = useContext(AuthedUserContext);
    const navigate = useNavigate();
    
    const handleFormSwap = () => {
        setLoginForm(loginForm*-1)
        // console.log(loginForm)
    }
    const handleSignout = () => {
      authService.signout();
      setUser(null);
    };
    
    useEffect(() => {
      if (user) {
        navigate('/dashboard')
      }
    }, [user]);
  
    /*--------------- Return ---------------*/
  
    return (
      <>
        {/* <p>{JSON.stringify(props)}</p> */}
        <main className="flex min-h-full overflow-hidden pt-16 sm:py-28">
            {loginForm > 0 ? (
                <>
                    <SigninForm setUser={props.setUser} handleFormSwap={handleFormSwap}/>
                </>
            ):(
                <SignupForm setUser={props.setUser} handleFormSwap={handleFormSwap}/>
            )}
        </main>
      </>
    )
  }
  
  export default Home
  