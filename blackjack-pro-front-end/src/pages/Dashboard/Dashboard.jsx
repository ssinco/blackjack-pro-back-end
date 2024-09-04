/* =======================================================
Imports
=======================================================*/


import { useState, createContext,useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthedUserContext } from '../../App';

import * as authService from '../../services/authService'


import { findBestTime, findBestStreak, findMedianTime } from '../../hooks/useGameStats';


import { Container } from '../../components/custom/Container/Container'
import { Card } from '../../components/custom/Card/Card'
import Logo from '../../components/custom/Logo/Logo'

import { Stat } from '../../components/template/stat'
import { Avatar } from '../../components/template/avatar'
import { Button } from '../../components/template/button'
import { Heading, Subheading } from '../../components/template/heading'
import { Divider } from '../../components/template/divider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/table'

/* =======================================================
Helper Functions
=======================================================*/


/* =======================================================
Component
=======================================================*/



const Dashboard = ({gameLogs}) => {

    /*--------------- States/Hooks ---------------*/
    const user = useContext(AuthedUserContext);
    const navigate = useNavigate(); // Hook for navigation
  
  
    /*--------------- Helper Functions ---------------*/
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        // const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    };
    
    const formatDuration = (milliseconds) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const ms = Math.floor((milliseconds % 1000) / 10);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${ms < 10 ? '0' : ''}${ms}`;
    }
    
    const iconWinLoss = (boolean) => {
        return boolean
        // if boolean is True
        ? <img src="/assets/icons/checkmark.svg" alt="Checkmark" style={{ width: '20px', height: '20px' }} />
        // if boolean is False
        : <img src="/assets/icons/crossmark.svg" alt="Cross" style={{ width: '20px', height: '20px' }} />;
    }


    /*--------------- Event Handlers ---------------*/
    const handleStartGameClick = () => {
        navigate('/game/count-single'); // Navigate to the desired route
        
    }
  
    /*--------------- Return ---------------*/
    console.log(gameLogs)
    
  
    return (
        (!user)? <p>Loading...</p> 
        : (
        <>
            <div className = "flex flex-col items-center max-w-full sm:max-w-xl mx-auto">
                <Container className =" w-full  sm:mx-auto sm:max-w-4xl" onClick={handleStartGameClick}>
                    <Card className="flex flex-col gap-8 items-center justify-between">
                        <div className="flex gap-4 items-center max-w-fit">
                            <Logo className ="h-full"/>
                            <div>
                                <Heading className="text-zinc-950 text-wrap">Single Deck Count</Heading>
                                <p className="text-s text-wrap">Practice counting down one deck</p>
                            </div>

                        </div>
                        <div className="flex justify-center w-full">
                            <Button color="green" onClick={handleStartGameClick} className="w-6/12">Play</Button>
                        </div>
                    </Card>

                    {/* ICON */}

                    {/* Game title */}

                    {/* Button */}
                </Container>

                <Container className ="flex justify-around w-full items-center sm:mx-auto">
                    {/* <p>{JSON.stringify(user)}</p> */}
                    {/* <h1>Dashboard for user</h1> */}
                    
                    <Stat title="Median Time" value={formatDuration(findMedianTime(gameLogs))}/>
                    <Stat title="Best Streak" value={findBestStreak(gameLogs)} />
                    <Stat title="Best Time" value={formatDuration(findBestTime(gameLogs))} />
                    
                </Container>
                <Divider soft className="my-6 bg-gray-600"/>
                <div className>
                    <Heading className="text-center mb-4 text-gray-300">Your Last 10 Records</Heading>

                    <Divider/>

                    
                    <Table dense className=" justify-center border border-zinc-600 mx-0 max-w-full rounded-lg dark:border-white/10 dark:bg-zinc-900 py-3 px-3">

                        <TableHead>
                            <TableRow>
                            <TableHeader className="text-center text-gray-400">Time</TableHeader>
                            <TableHeader className="text-center text-wrap text-gray-400">Last Card Guess</TableHeader>
                            <TableHeader className="text-center text-wrap text-gray-400">Count Guess</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gameLogs && 
                                gameLogs
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .slice(0, 10)
                                .map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center text-white">{formatDuration(log.duration)}</TableCell>
                                    <TableCell><div className="flex justify-center text-white">{iconWinLoss(log.guessLastCardCorrect)}</div></TableCell>
                                    <TableCell><div className ="flex justify-center text-white">{iconWinLoss(log.guessCountCorrect)}</div> </TableCell>
                                </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
            
        </>
        )
    )
  }
  
  export default Dashboard
  