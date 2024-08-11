/* =======================================================
Imports
=======================================================*/

import { useState, createContext,useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import React from 'react'
import useTimer from '../../hooks/useTimer';


import styles from "./GameCountSnapshot.module.css"
import * as gameLogService from '../../services/gameLogService'

import * as logSnapshotService from '../../services/logSnapshotService'

import DealerHand from '../Hands/DealerHand';
import PlayerHand from '../Hands/PlayerHand';



/* =======================================================
Helper Functions
=======================================================*/

const createDeck = () => {
  // Create an array of suits
  // const suits = ['hearts'.]
  const suits = ['hearts','diamonds','spades','clubs']
  // Create an array of card values, 2 to A
  const values = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'jack', 'queen', 'king', 'ace'
  ]
  // Build a deck with 52 indices
  const deck = []

  for (let i = 0; i < 2; i++){
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ 
          value, 
          suit, 
          image: `/src/assets/cards/${value}_${suit}.png`,
        });
      }
    }
  }
  return deck
}

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}


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
    ? <img src="/src/assets/icons/checkmark.svg" alt="Checkmark" style={{ width: '20px', height: '20px' }} />
    // if boolean is False
    : <img src="/src/assets/icons/crossmark.svg" alt="Cross" style={{ width: '20px', height: '20px' }} />;
}


/* =======================================================
Component
=======================================================*/


const GameCountSnapshot=({logsSnapshot, setLogsSnapshot})=> {
  /*--------------- States/Hooks ---------------*/
  const { time, startTimer, stopTimer, resetTimer, formatTime } = useTimer(); // Use the custom hook
  const [deck, setDeck] = useState(shuffleDeck(createDeck()))
  const [gameLive, setGameLive] = useState(false);

  // Need to manage the state for the board
  const [board, setBoard] = useState({
    dealer: [],
    playerOne: [],
    playerTwo: [],
    playerThree: [],
})

  const [count, setCount] = useState(0)
  const [round, setRound] = useState(0)

  const [formData, setFormData] = useState({
    guessCount: 0,
    actualCount: 0,
    duration: 0,
  })

  useEffect(() => {
    if (gameLive) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [gameLive])

  const handleDraw = async () => {
    setGameLive(true)
    // will need these to modify the count
    const lowValues = ['2', '3', '4', '5', '6']
    const highValues = ['10','jack', 'queen', 'king', 'ace']

    // make sure you can only draw when there are cards left
    if (round < 10) {
      const cardsToDeal = await deck.slice(0,Object.keys(board).length*2)
      const cardsDealt = {
        dealer: [cardsToDeal[0],cardsToDeal[1]],
        playerOne: [cardsToDeal[2],cardsToDeal[3]],
        playerTwo: [cardsToDeal[4],cardsToDeal[5]],
        playerThree: [cardsToDeal[6],cardsToDeal[7]],
      }
      deck.splice(0,Object.keys(board).length*2)
      setBoard(cardsDealt)

      // Calculate the new count based on the cards dealt
      let newCount = count;
      cardsToDeal.forEach((card) => {
        console.log(card.value)
        if (lowValues.includes(card.value)) {
          newCount += 1;
        } else if (highValues.includes(card.value)) {
          newCount -= 1;
        }
      });

      // Update the count state once
      setCount(newCount);
      setRound(round + 1);

      console.log('Total players = ', Object.keys(board).length, '| Cards to deal = ', cardsToDeal)  
      console.log('New board',board)
    }

    else {
      console.log('game is over')
    } 
  }



  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    setGameLive(false)
    console.log('submit')
    console.log('timer is ', time)
    console.log('timer type is ', typeof time)

    // Update formData state with the latest count
    const updatedFormData = {
      ...formData,
      actualCount: count,
      guessCount: formData.guessCount,
      guessCountCorrect: (Number(formData.guessCount) === count),
      duration: time,
    };
  
    // Set the updated formData state
    setFormData(updatedFormData);

    console.log('form data is', updatedFormData);
    
    // Create a DB record with count guess
    try {
      const newLog = await logSnapshotService.create(updatedFormData);
      setLogsSnapshot([newLog, ...logsSnapshot])
      console.log('Game log created successfully');
    } catch (error) {
      console.error('Error creating game log', error);
    }
  }

  const handleShuffle = async ()=> {
    setDeck(shuffleDeck(createDeck()))
    setCount(0)
    setRound(0)
    resetTimer()
    setGameLive(false)
    setBoard({
      dealer: [],
      playerOne: [],
      playerTwo: [],
      playerThree: [],
    })
  }

  const handleChange = (e) => {
    console.log(formData)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  /*--------------- Return ---------------*/

  return (
    <>
      
      <div className={styles.gameContainer}>
        
        <h1>Snapshot Game</h1>
        <div className="gameStats">
          <p>Count: {count}</p>
          <p>Round: {round}</p>
          <p>Time: {formatTime(time)}</p>
        </div>

        <div className={styles.dealerContainer}>
          {board.dealer.length > 0 ? (
          <div className={styles.player}>
            <h3>Dealer</h3>
            <div className = {styles.playerCards}>
              <div className = {styles.card}><img src ={board.dealer[0].image}/></div>
              <div className = {styles.card}><img src ={board.dealer[1].image}/></div>
            </div>
          </div>
          ) : (
            <p>nocards</p>
          )}
        </div>

        <div className={styles.playersContainer}>
          {board.playerOne.length > 0 ? (
            <>
              <div className={styles.player}>
                <h3>Player 1</h3>
                <div className = {styles.playerCards}>
                  <div className = {styles.card}><img src ={board.playerOne[0].image}/></div>
                  <div className = {styles.card}><img src ={board.playerOne[1].image}/></div>
                </div>
              </div>
              <div className={styles.player}>
              <h3>Player 2</h3>
                <div className = {styles.playerCards}>
                <div className = {styles.card}><img src ={board.playerTwo[0].image}/></div>
                <div className = {styles.card}><img src ={board.playerTwo[1].image}/></div>
                </div>
              </div>
              <div className={styles.player}>
              <h3>Player 3</h3>
                <div className = {styles.playerCards}>
                <div className = {styles.card}><img src ={board.playerThree[0].image}/></div>
                <div className = {styles.card}><img src ={board.playerThree[1].image}/></div>
                </div>
              </div>
            </>
          ) : (
            <p>nocards</p>
          )}

        </div>
        
        {round < 10 ? (
          <div>
              <button onClick={handleDraw}>{round === 0 ? ('Draw to Start'):('Draw')}</button>
          </div>
        ) : (
          <>
            {gameLive ? (
              <div>
                <form onSubmit={ handleGuessSubmit }>
                  <div className={styles.guessCount}>
                    <label htmlFor="guessCount">Guess the count:</label>
                    <input
                      type="text"
                      id="guessCount"
                      placeholder="Enter a number"
                      name="guessCount"
                      onChange={handleChange}
                      required
                      />
                  </div>
                  <button type="submit">Submit Guess</button>
                </form>
              </div>
            ):(
              <>
                <div className={styles.resultsTable}>
                  <div className={styles.resultCount}>
                    <p>Actual count: {formData.actualCount}</p>
                    <h4>Count guess: {formData.guessCount}</h4>
                  </div>
                  <button onClick={handleShuffle}>Shuffle</button>
                </div>
              </> 
            )}
          </>
        )}
        
        <div className={styles.gameLogContainer}>
          <div className={styles.gameLogTable}>
            <div>Date</div>
            <div>Time</div>
            <div>Count Correct?</div>
            {logsSnapshot
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((log, index) => (
                <React.Fragment key={index}>
                  <div className={styles.gridItem}>{formatDate(log.createdAt)}</div>
                  <div className={styles.gridItem}>{formatDuration(log.duration)}</div>
                  <div className={styles.gridItem}>{iconWinLoss(log.guessCountCorrect)}</div>
                </React.Fragment>
              ))}
          </div>
        </div>

        {/* test deck */}
        <ol className={styles.deckContainer}>
          {deck.map((card,index) => (
            <li className={styles.gridItem} key={index}>{card.value}-{card.suit}</li>
          ))}
        </ol>

      </div>

    </>
  )
}

export default GameCountSnapshot
