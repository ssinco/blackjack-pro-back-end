/* =======================================================
Imports
=======================================================*/

import { useState, createContext,useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css'


import Home from './pages/Home/Home';
import NavBar from './components/custom/NavBar/NavBar';
import Dashboard from './pages/Dashboard/Dashboard';
import GameCountSingle from './pages/GameCountSingle/GameCountSingle';
// import GameCountSnapshot from './components/GameCountSnapshot/GameCountSnapshot';
// import GameBlackjack from './components/GameBlackjack/GameBlackjack';



import * as authService from '../src/services/authService'

import * as gameLogService from '../src/services/gameLogService'
import * as logSnapshotService from '../src/services/logSnapshotService'

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
  const [logsSnapshot, setLogsSnapshot] = useState([])
  const navigate = useNavigate();
  
  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  useEffect(() => {
    console.log('App user state:', user);
    if (!user) {
      navigate('/')
    }
  }, [user]);
  
  
  


    // fecthing all the game log for Single count
    useEffect(() => {
      const fetchAllLogs = async () => {
      const gameLogData = await gameLogService.index();
          setGameLogs(gameLogData)
      };
      fetchAllLogs();
    }, [user])
  

    // fecthing all the game log for Snapshot
    useEffect(() => {
      const fetchAllLogs = async () => {
      const gameLogData = await logSnapshotService.index();
        setLogsSnapshot(gameLogData)
      };
      fetchAllLogs();
    }, [user])



  /*--------------- Return ---------------*/

  return (
    <>
        <AuthedUserContext.Provider value={user}>
          <NavBar handleSignout={handleSignout}/>
          <div className="appContainer">
            
              <Routes>
                
                {/* Protected Routes */}
                <Route path="/" element={<Home setUser={setUser}/>}/>

                { user && (
                  <>
                  <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/game/count-single" element={<GameCountSingle gameLogs={gameLogs} setGameLogs={setGameLogs}/>}/>
                  {/* <Route path="/game/count-snapshot" element={<GameCountSnapshot logsSnapshot={logsSnapshot} setLogsSnapshot={setLogsSnapshot}/>}/> */}
                  </>
                )}
                
              </Routes>
            
          </div>
        </AuthedUserContext.Provider>
    </>
  )
}

export default App
