/* =======================================================
Imports
=======================================================*/

import { useState, useEffect, useRef, useContext } from 'react'
import React from 'react'
import useTimer from '../../hooks/useTimer';
import { AuthedUserContext } from '../../App';
import { AnimatePresence, motion } from 'framer-motion';


import { Container, ContainerGame } from '../../components/custom/Container/Container'
import { Heading, Subheading } from '../../components/template/heading'
import { Button } from '../../components/template/button'

import * as authService from '../../services/authService'
import * as gameLogService from '../../services/gameLogService'

import styles from './GameCountSingle.module.css'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/template/table'


/* =======================================================
Helper Functions
=======================================================*/


const createDeck = () => {
  // Create an array of suits
  // const suits = ['hearts'.]
  const suits = ['hearts','diamonds','spades','clubs']
  // Create an array of card values, 2 to A
  const values = [
    '2'
  ]


  // const values = [
  //   '2', '3', '4', '5', '6', '7', '8', '9', '10',
  //   'jack', 'queen', 'king', 'ace'
  // ]


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

  const lowValues = ['2', '3', '4', '5', '6'];
  const highValues = ['10', 'jack', 'queen', 'king', 'ace'];
  
  const [deck, setDeck] = useState(shuffleDeck(createDeck()))
  const [card, setCard] = useState({})
  const [lastCard, setLastCard] = useState({})
  const [count, setCount] = useState(0)
  const [gameLive, setGameLive] = useState(false)
  const [showGameLogs, setShowGameLogs] = useState(false);
  const [message, setMessage] = useState('');

  const { time, startTimer, stopTimer, resetTimer, formatTime } = useTimer() // Use the custom hook
  const user = useContext(AuthedUserContext)

  useEffect(() => {
    if (gameLive && deck.length === 51) {
      setLastCard(deck[deck.length-1])
      startTimer();
    } else if (deck.length === 0) {
      stopTimer();
    }
  }, [deck]);


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
    setShowGameLogs(false)
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

  const handleDrawAndSubmit = async (e) => {
    e.preventDefault();
  
    let newCount = count;
  
    if (deck.length > 0) {
      const drawnCard = deck[0]; // Get the first card
      const newDeck = deck.slice(1); // Create a new deck array without the first card
      setCard(drawnCard); // Set the drawn card
      setDeck(newDeck); // Update the deck state
  
      if (lowValues.includes(drawnCard.value)) {
        newCount = count + 1;
      } else if (highValues.includes(drawnCard.value)) {
        newCount = count - 1;
      }
  
      setCount(newCount); // Update the state with the new count
    } else {
      console.log('No more cards in the deck');
    }
  
    setGameLive(true);
  
    // Guess submission logic
    const checkLastCard = () => {

      const lastCardRange = () =>{
        if (lowValues.includes(lastCard.value)) {
          return 'Low: 2 to 6'
        } else if (highValues.includes(lastCard.value)) {
          return 'High: 10 to Ace'
        } else {
          return 'Mid: 7 to 9'
        }
      }
      // if (newCount > 0) return formData.guessLastCardRange === lastCardRange()
      // if (newCount < 0) return formData.guessLastCardRange === lastCardRange()
      // if (newCount === 0) return formData.guessLastCardRange === lastCardRange()
      return formData.guessLastCardRange === lastCardRange()
    };
  
    // Update formData state with the latest count
    const updatedFormData = {
      ...formData,
      actualCount: newCount,
      actualLastCard: deck[deck.length - 1],
      guessCountCorrect: Number(formData.guessCount) === newCount,
      guessLastCardCorrect: checkLastCard(),
      duration: time,
    };
  
    // Set the updated formData state
    setFormData(updatedFormData);
  
    console.log('form data is', updatedFormData);
  
    // Create a DB record for the single deck count
    try {
      const newLog = await gameLogService.create(updatedFormData);
      setGameLogs([newLog, ...gameLogs]);
      console.log('Game log created successfully');
    } catch (error) {
      console.error('Error creating game log', error);
    }

    setShowGameLogs(true)

    if (updatedFormData.guessCountCorrect && updatedFormData.guessLastCardCorrect) {
      setMessage('You guessed right! Shuffle to try again')
    } else {
      setMessage('So close! Shuffle to try again')
    }
  };

  const handleChange = (e) => {
    console.log(formData)
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  /*--------------- Return ---------------*/

  return (
    <>
      <ContainerGame>
        
          
          <div className={styles.gameBoard}>
            <div className={styles.gameStats} data-count={count}>
              <h4 className = "font-mono text-center font-thin">&nbsp;{formatTime(time)}&nbsp;</h4>
              
            </div>
            <div className={styles.cardPile}>
              <div className={styles.card} id="undrawn">              
                {deck.length > 0 && <img src='/assets/cards/red_cardback.png' alt='deck-of-cards'/>}
                
              </div>
              <div className={styles.card} id="drawn">
                {card.image && <img src={card.image} alt={`${card.value} of ${card.suit}`} />}
              </div>
           
            </div>
            
            {deck.length > 1 && <Button color="green" className="w-full" onClick={handleDraw}>Draw</Button>}

            {deck.length === 1 && 
              // Last card guess form 
              <>
                <div className={styles.formContainer}>
                  <form onSubmit={
                          handleDrawAndSubmit 
                      }>
                  
                    <div className={styles.guessCount}>
                      <label htmlFor="guessCount" className="text-gray-400">Guess the final count:</label>
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

                    <fieldset className={styles.guessCard}>
                      <legend>
                        <label className="text-gray-400">Guess the last card:</label>
                        </legend>
                      <div className={styles.inputContainer}>
                        <input 
                          type="radio"
                          id="lowCardGuess"
                          name="guessLastCardRange"
                          value="Low: 2 to 6"
                          onChange={handleChange} 
                          required
                        />
                        <label htmlFor="lowCardGuess">2 to 6</label>
                      </div>

                      <div className={styles.inputContainer}>
                      <input 
                          type="radio"
                          id="midCardGuess"
                          name="guessLastCardRange"
                          value="Mid: 7 to 9"
                          onChange={handleChange}
                  
                        />
                        <label htmlFor="midCardGuess">7 to 9</label>
                      </div>
                      
                      <div className={styles.inputContainer}>
                        <input 
                          type="radio"
                          id="highCardGuess"
                          name="guessLastCardRange"
                          value="High: 10 to Ace"
                          onChange={handleChange}
                          
                        />
                        <label htmlFor="highCardGuess">10 to Ace</label>
                      </div>
                    </fieldset>
                  
                    <button
                      className={`${styles.submitButton} ${formData.guessCount && formData.guessLastCardRange ? styles.enabled : styles.disabled}`}
                      type="submit"
                      disabled={!formData.guessCount || !formData.guessLastCardRange}
                    >
                      Submit & Draw Last Card
                    </button>
                    
                </form>
                </div>
                
              </>  
            }
            {deck.length === 0 &&
            // End game view 
              <>
                {/* <div className ={styles.resultsTable}>

                  <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                      <p>Your Guess:</p>
                    </div>
                

                    <h4>Count: {formData.guessCount}</h4>
                    <h4>{formData.guessLastCardRange}</h4>
                  </div>

                  <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                      <p>Final:</p>
                    </div>
                    <div className={styles.resultActual}>
                      <h4>Count: {formData.actualCount}</h4>
                      {iconWinLoss(formData.guessCountCorrect)}
                    </div>

                    <div className={styles.resultActual}>
                      <h4>{formData.actualLastCard.value}-{formData.actualLastCard.suit}</h4>
                      {iconWinLoss(formData.guessLastCardCorrect)}
                    </div>

                    
                  </div>

                </div> */}
                <Table 
                  key={showGameLogs ? 'visible' : 'hidden'} 
                  dense 
                  className=" justify-center border border-zinc-600 mx-0 rounded-lg dark:border-white/10 dark:bg-zinc-900 py-3 px-3">

                  <TableHead>
                      <TableRow>
                      <TableHeader className="text-wrap text-gray-400"></TableHeader>
                      <TableHeader className="text-xs text-wrap text-gray-400">Your Guess</TableHeader>
                      <TableHeader className="text-xs text-wrap text-gray-400">Actual</TableHeader>
                      <TableHeader className="text-wrap text-gray-400"></TableHeader>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      
                      <TableRow>
                          <TableCell className="font-medium text-white text-xs">Count:</TableCell>
                          <TableCell><div className=" text-white text-wrap">{formData.guessCount}</div></TableCell>
                          <TableCell><div className =" text-white text-wrap">{formData.actualCount}</div> </TableCell>
                          <TableCell className="!px-0 min-w-[20px]"><div>{iconWinLoss(formData.guessCountCorrect)}</div></TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell className="font-medium text-white text-xs">Last Card:</TableCell>
                          <TableCell><div className=" text-white text-wrap">{formData.guessLastCardRange}</div></TableCell>
                          <TableCell><div className =" text-white text-wrap">{formData.actualLastCard.value}</div> </TableCell>
                          <TableCell className="!px-0 min-w-[20px]"><div>{iconWinLoss(formData.guessLastCardCorrect)}</div>{formData.guessLastCardCorrect}</TableCell>
                      </TableRow>
                        
                  </TableBody>
                </Table> 
                <div>
                  <Button color="green" className="w-full" onClick={handleShuffle}>Shuffle</Button>
                  {message && <div className="text-gray-400 text-xs mt-3">{message}</div>}
                </div>

                
              </> 
            }

            {/* <Table dense className=" justify-center border border-zinc-600 mx-0 max-w-full rounded-lg dark:border-white/10 dark:bg-zinc-900 py-3 px-3">

                        <TableHead>
                            <TableRow>
                            <TableHeader className="text-wrap text-gray-400"></TableHeader>
                            <TableHeader className="text-xs text-wrap text-gray-400">Your Guess</TableHeader>
                            <TableHeader className="text-xs text-wrap text-gray-400">Actual</TableHeader>
                            <TableHeader className="text-wrap text-gray-400"></TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            
                            <TableRow>
                                <TableCell className="font-medium text-white">Count:</TableCell>
                                <TableCell><div className=" text-white">{formData.guessCount}</div></TableCell>
                                <TableCell><div className =" text-white">{formData.actualCount}</div> </TableCell>
                                <TableCell>{iconWinLoss(formData.guessCountCorrect)}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell className="font-medium text-white">Last Card:</TableCell>
                                <TableCell><div className=" text-white">{formData.guessLastCardRange}</div></TableCell>
                                <TableCell><div className =" text-white">{formData.actualLastCard.value}-{formData.actualLastCard.suit}</div> </TableCell>
                                <TableCell>{iconWinLoss(formData.guessLastCardCorrect)}</TableCell>
                            </TableRow>
                              
                        </TableBody>
                    </Table>         */}
          </div>

         
        
      </ContainerGame>
      <Container>
        <AnimatePresence>
            {showGameLogs && (
              <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5 }}
              className="max-w-full"
              // className={styles.gameLogContainer}
            >
              {/* <div className={styles.gameLogContainer}> */}

                {/* <div className={styles.gameLogTable}>
                  
                  <div className={styles.tableHeader}><h4>Time</h4></div>
                  <div className={styles.tableHeader}><h4>Last Card Guess Correct?</h4></div>
                  <div className={styles.tableHeader}><h4>Count Guess Correct?</h4></div>
                  {gameLogs
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((log, index) => (
                      <React.Fragment key={index}>
                    
                        <div className={styles.gridItem}>{formatDuration(log.duration)}</div>
                        <div className={styles.gridItem}>{iconWinLoss(log.guessLastCardCorrect)}</div>
                        <div className={styles.gridItem}>{iconWinLoss(log.guessCountCorrect)}</div>
                      </React.Fragment>
                    ))}
                </div> */}
                
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
                                .slice(0, 5)
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
              {/* </div> */}
              </motion.div>
            )}
          </AnimatePresence>

      </Container>
    </>
  )
}

export default GameCountSingle
