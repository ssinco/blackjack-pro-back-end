/* =======================================================
Imports
=======================================================*/


import { useState, createContext,useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthedUserContext } from '../../App';

import * as authService from '../../services/authService'




/* =======================================================
Helper Functions
=======================================================*/


/* =======================================================
Component
=======================================================*/



const Dashboard = (props) => {

    /*--------------- States/Hooks ---------------*/
    const user = useContext(AuthedUserContext);
  
  
  
  
    /*--------------- Return ---------------*/

    
  
    return (
        (!user)? <p>Loading...</p> 
        : (
        <>
            <p>{JSON.stringify(user)}</p>
            <h1>Dashboard for user</h1>
        </>
        )
    )
  }
  
  export default Dashboard
  