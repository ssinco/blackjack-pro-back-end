/* =======================================================
Imports
=======================================================*/

import { useState, createContext,useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css'


import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import Dashboard from './components/Dashboard/Dashboard';
import GameCountSingle from './components/GameCountSingle/GameCountSingle';
import GameCountSnapshot from './components/GameCountSnapshot/GameCountSnapshot';
import GameBlackjack from './components/GameBlackjack/GameBlackjack';



import * as authService from '../src/services/authService'
import * as gameLogService from '../src/services/gameLogService'

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
  const [gameLogs, setGameLogs] = useState([])

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  useEffect(() => {
    console.log('App user state:', user);
  }, [user]);
  
  // const navigate = useNavigate();


    // fetching all game logs for this game for the user
    useEffect(() => {
      const fetchAllLogs = async () => {
      const gameLogData = await gameLogService.index();
          setGameLogs(gameLogData)
      };
      fetchAllLogs();
    }, [user])
  



  /*--------------- Return ---------------*/

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout}/>
        <div className="appContainer">
          
            <Routes>
              
              {/* Protected Routes */}
              <Route path="/" element={<Home setUser={setUser}/>}/>

              { user && (
                <>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/game/count-single" element={<GameCountSingle gameLogs={gameLogs} setGameLogs={setGameLogs}/>}/>
                <Route path="/game/count-snapshot" element={<GameCountSnapshot/>}/>
                <Route path="/game/blackjack" element={<GameBlackjack/>}/>
                </>
              )}
              
            </Routes>
          
        </div>
      </AuthedUserContext.Provider>
    </>
  )
}

export default App
