/* =======================================================
Imports
=======================================================*/

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import useTimer from '../../hooks/useTimer';

import './GameCountSingle.css'

import * as authService from '../../services/authService'
import * as gameLogService from '../../services/gameLogService'



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

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ 
        value, 
        suit, 
        image: `/assets/cards/${value}_${suit}.png`,
      });
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
    ? <img src="/assets/icons/checkmark.svg" alt="Checkmark" style={{ width: '20px', height: '20px' }} />
    // if boolean is False
    : <img src="/assets/icons/crossmark.svg" alt="Cross" style={{ width: '20px', height: '20px' }} />;
}

/* =======================================================
Component
=======================================================*/


const GameCountSingle =({gameLogs, setGameLogs})=> {

  /*--------------- States/Hooks ---------------*/


  const [deck, setDeck] = useState(shuffleDeck(createDeck()))
  const [card, setCard] = useState({})
  const [count, setCount] = useState(0)
  const [gameLive, setGameLive] = useState(false);
  const { time, startTimer, stopTimer, resetTimer, formatTime } = useTimer(); // Use the custom hook


  useEffect(() => {
    if (gameLive && deck.length === 51) {
      startTimer();
    } else if (deck.length === 0) {
      stopTimer();
    }
  }, [deck]);

  //

  const [formData, setFormData] = useState({
    guessCount: 0,
    actualCount: 0,
    actualLastCard: {},
    guessLastCardRange: '',
    guessCountCorrect: null,
    guessLastCardCorrect: null,
    duration: 0,
  })


  const handleShuffle = () => {
    setDeck(shuffleDeck(createDeck()))
    setCount(0)
    setCard({})
    resetTimer()
    setGameLive(false)
  }
  
  const handleDraw = () => {
      const lowValues = ['2', '3', '4', '5', '6']
      const highValues = ['10','jack', 'queen', 'king', 'ace']
      if (deck.length > 0) {
        const drawnCard = deck[0]; // Get the first card
        const newDeck = deck.slice(1); // Create a new deck array without the first card
        setCard(drawnCard); // Set the drawn card
        setDeck(newDeck); // Update the deck state
        if (lowValues.includes(drawnCard.value)){setCount(count + 1)}
        else if (highValues.includes(drawnCard.value)){setCount(count - 1)}  
      } else {
        console.log('No more cards in the deck');
      }
      setGameLive(true)
    };

  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    // check if last card guess is correct
    const checkLastCard = () => {
      if (count > 0) {return formData.guessLastCardRange === "High: 10 to Ace"}
      if (count < 0) {return formData.guessLastCardRange === "Low: 2 to 6"}
      if (count === 0) {return formData.guessLastCardRange === "Mid: 7 to 9"}
    }
    console.log('timer is ', time)
    console.log('timer type is ', typeof time)

    // Update formData state with the latest count
    const updatedFormData = {
      ...formData,
      actualCount: count,
      actualLastCard: deck[deck.length-1],
      guessCountCorrect: (Number(formData.guessCount) === count),
      guessLastCardCorrect: checkLastCard(),
      duration: time,
    };
  
    // Set the updated formData state
    setFormData(updatedFormData);

    console.log('form data is', updatedFormData);
    handleDraw()
    // Create a DB record for the single deck count
    try {
      const newLog = await gameLogService.create(updatedFormData);
      setGameLogs([newLog, ...gameLogs])
      console.log('Game log created successfully');
    } catch (error) {
      console.error('Error creating game log', error);
    }
  };

  const handleChange = (e) => {
    console.log(formData)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  /*--------------- Return ---------------*/

  return (
    <>
      <div className="gameContainer">
        <h1>Single Deck Count</h1>
        <div className="gameBoard">
          <div className="gameStats">
            <p>Time: {formatTime(time)}</p>
            <p>Count: {count}</p>
          </div>
          <div className="cardPile">
            <div className="card" id="undrawn">              
              {deck.length > 0 && <img src='/assets/cards/red_cardback.png' alt='deck-of-cards'/>}
              
            </div>
            <div className="card" id="drawn">
              {card.image && <img src={card.image} alt={`${card.value} of ${card.suit}`} />}
            </div>
            {/* <div className="deck">
              <ol>
              {deck.map((card,index) => (
                  <li key={index}>{card.value} - {card.suit}</li>
              ))}
              </ol>
            </div> */}
          </div>
          
          {deck.length > 1 && <button onClick={handleDraw}>Draw</button>}
          {deck.length === 1 && 
            // Last card guess form 
            <>
              <form onSubmit={handleGuessSubmit}>
                <div className="formContainer">
                  <div className="guessCount">
                    <label htmlFor="guessCount">Guess the count:</label>
                    <input
                      type="text"
                      id="guessCount"
                      placeholder="Enter a number"
                      name="guessCount"
                      // value="guessCount"
                      onChange={handleChange}
                      required
                      />
                  </div>

                  <fieldset className="guessCard">
                    <legend>Guess the last card:</legend>
                    <input 
                      type="radio"
                      id="lowCardGuess"
                      name="guessLastCardRange"
                      value="Low: 2 to 6"
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="lowCardGuess">Low: 2 to 6</label>

                    <input 
                      type="radio"
                      id="midCardGuess"
                      name="guessLastCardRange"
                      value="Mid: 7 to 9"
                      onChange={handleChange}
              
                    />
                    <label htmlFor="midCardGuess">Mid: 7 to 9</label>

                    <input 
                      type="radio"
                      id="highCardGuess"
                      name="guessLastCardRange"
                      value="High: 10 to Ace"
                      onChange={handleChange}
                      
                    />
                    <label htmlFor="highCardGuess">High: 10 to Ace</label>
                  </fieldset>
                </div>
                <button type="submit">Submit & Draw Last Card</button>
              </form>
              
            </>  
          }
          {deck.length === 0 &&
          // End game view 
            <>
              <div className ="resultsTable">
                <div className="resultCount">
                  <p>Actual count before last card: {formData.actualCount}</p>
                  <h4>Count guess befoe last card: {formData.guessCount}</h4>
                </div>
                <div className="resultLastCard">
                  <p>Actual last card: {formData.actualLastCard.value}-{formData.actualLastCard.suit}</p>
                  <h4>Last card guess: {formData.guessLastCardRange}</h4>
                </div>
              </div>
              <button onClick={handleShuffle}>Shuffle</button>
            </> 
          }        
        </div>
        <div className="gameLogContainer">

          <div className="gameLogTable">
            <div>Date</div>
            <div>Time</div>
            <div>Last Card Guess Correct?</div>
            <div>Count Correct?</div>
            {gameLogs
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((log, index) => (
                <React.Fragment key={index}>
                  <div className="grid-item">{formatDate(log.createdAt)}</div>
                  <div className="grid-item">{formatDuration(log.duration)}</div>
                  <div className="grid-item">{iconWinLoss(log.guessLastCardCorrect)}</div>
                  <div className="grid-item">{iconWinLoss(log.guessCountCorrect)}</div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default GameCountSingle
