/* =======================================================
Imports
=======================================================*/


import { useState, createContext,useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthedUserContext } from '../../App';

import * as authService from '../../services/authService'


import { Container } from '../../components/custom/Container/Container'
import { Card } from '../../components/custom/Card/Card'


import { Stat } from '../../components/template/stat'
import { Avatar } from '../../components/template/avatar'
import { Button } from '../../components/template/button'
import { Heading } from '../../components/template/heading'


/* =======================================================
Helper Functions
=======================================================*/


/* =======================================================
Component
=======================================================*/



const Dashboard = (props) => {

    /*--------------- States/Hooks ---------------*/
    const user = useContext(AuthedUserContext);
    const navigate = useNavigate(); // Hook for navigation

  
  
    /*--------------- Event Handlers ---------------*/
    const handleStartGameClick = () => {
        navigate('/game/count-single'); // Navigate to the desired route
    }
  
    /*--------------- Return ---------------*/

    
  
    return (
        (!user)? <p>Loading...</p> 
        : (
        <>
            
            <Container className ="flex justify-around w-fullitems-center max-w-sm sm:mx-auto min-w-[480px]">
                <Card>
                <div className="flex gap-3" >
                <Avatar className="size-10" src={user.avatarUrl} />
                <Heading>Single Deck Count</Heading>
                </div>
                <Button color="green" onClick={handleStartGameClick}>
                    Start Game
                </Button>
                </Card>

                {/* ICON */}

                {/* Game title */}

                {/* Button */}
            </Container>

            <Container className ="flex justify-around w-fullitems-center max-w-sm sm:mx-auto min-w-[480px]">
                {/* <p>{JSON.stringify(user)}</p> */}
                {/* <h1>Dashboard for user</h1> */}
                
                <Stat title="Avg Time" value="5,888" />
                <Stat title="Best Streak" value="5,888" />
                <Stat title="Best Time" value="5,888" />
            </Container>
            
        </>
        )
    )
  }
  
  export default Dashboard
  