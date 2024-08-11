/* =======================================================
Imports
=======================================================*/

import { useState, createContext,useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import React from 'react'
import useTimer from '../../hooks/useTimer';
import useScenarios from '../../hooks/useScenarios';


import styles from "./GameBasicStrategy.module.css"
import * as gameLogService from '../../services/gameLogService'

import * as logSnapshotService from '../../services/logSnapshotService'


/* =======================================================
Helper Functions
=======================================================*/



/* =======================================================
Component
=======================================================*/


const GameBasicStrategy=()=> {
  const { scenarios, setScenarios, nextScenario, buildScenarios } = useScenarios('test')
  const { time, startTimer, stopTimer, resetTimer, formatTime } = useTimer(); // Use the custom hook

  const [cards, setCards] = useState({})

  console.log(scenarios)

  /*--------------- States/Hooks ---------------*/


  // Structure
    // Div for the dealer hand. Randomly assign a card from the deck
    // Div for 2 player cards
      // if ___ setting
        // Set an array of combos
        // Set an array of dealer top cards
        // Create an array of optimal plays

  const handleChoice = (e) => {
    e.preventDefault()
    nextScenario()
  }
  
  const handleShuffle = (e) => {
    e.preventDefault()
    setScenarios(buildScenarios('pairs'))
  }

  /*--------------- Return ---------------*/
  if (!scenarios){
    return (<p>loading</p>)
  }

  return (
    <>
        <div className={styles.gameContainer}>
          <div className={styles.cards}>
            { scenarios.length ? (
              <div>
                  <div>
                    <h3>Dealer</h3>
                    <p>{scenarios[0].dealerUpCard}</p>

                    <h3>Player</h3>
                    <p>{scenarios[0].playerCards[0]}</p>
                    <p>{scenarios[0].playerCards[1]}</p>
                  </div>
                  <div>
                    <form onSubmit={handleChoice}>
                      <button type="submit">Hit</button>
                      <button type="submit">Stand</button>
                      <button type="submit">Split</button>
                      <button type="submit">Surrender</button>
                    </form>
                  </div>
              </div>
            ):(
              <div>
                <h3>No more cards</h3>
                <form onSubmit={handleShuffle}>
                  <button type="submit">shuffle</button>
                </form>
              </div>
            )}
            
            {/* { scenarios.length ? (
              scenarios.map((item,index) => (
              <div key={index} >
                  <h3>Dealer</h3>
                  <p>{item.dealerUpCard}</p>

                  <h3>Player</h3>
                  <p>{item.playerCards[0]}</p>
                  <p>{item.playerCards[1]}</p>
              </div>
              ))
              
            ):(
            <p>loading</p>
            )} */}
          </div>
        </div>    

    </>
  )
}

export default GameBasicStrategy
