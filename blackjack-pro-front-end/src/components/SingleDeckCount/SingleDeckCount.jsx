/* =======================================================
Imports
=======================================================*/

import { useState } from 'react'
import './SingleDeckCount.css'



/* =======================================================
Helper Functions
=======================================================*/

// Need a deck array
// Need to shuffle the deck
// Need to count up the deck



const createDeck = () => {
  // Create an array of suits
  const suits = ['hearts']
  // const suits = ['hearts','diamonds','spades','clubs']
  // Create an array of card values, 2 to A
  const values = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'J', 'Q', 'K', 'A'
  ]
  // Build a deck with 52 indices
  const deck = []

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit });
    }
  }
  return deck
}

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  console.log(deck)
  return deck;
}

const drawCard = (deck) => {

}


/* =======================================================
Component
=======================================================*/


function App() {
  /*--------------- States/Hooks ---------------*/

  const [deck, setDeck] = useState(shuffleDeck(createDeck()))
  const [card, setCard] = useState('')
  const [count, setCount] = useState(0)

  const [formData, setFormData] =useState({
    guessCount: '',
    guessCard: {
      value: '',
      suit:'',
    },
  })


  const handleShuffle = () => {
    setDeck(shuffleDeck(createDeck()))
    setCount(0)
  }

  const handleDraw = () => {
      const lowValues = ['2', '3', '4', '5', '6']
      const highValues = ['10','J', 'Q', 'K', 'A']
      // when user clicks [draw]
      // add a count
      // remove that card from deck
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
    };

  const handleGuessSubmit = () => {


    // Check if the count guess matches the count
    // Check if the card guess matches the last card

    // Clicking [guess]...
      // ends the round
      // creates a DB record for the single deck count

  }

  /*--------------- Return ---------------*/

  return (
    <>
      <p>{JSON.stringify(formData)}</p>
      <div className="gameContainer">
        <h1>BJ PAGE</h1>
        
        <div className="gameBoard">
          <div className="card">
            <h2>{card.value} - {card.suit}</h2>
          </div>
          <button onClick={handleDraw}>Draw</button>
        </div>

        {deck.length <= 1 && 
          <>
            <form>
              <div className="guessCount">
                <label htmlFor="countGuess">Guess the count:</label>
                <input
                  type="number"
                  id="countGuess"
                  placeholder="Enter a number"
                  name="countGuess"
                  // value={formData.countGuess}
                  // onChange={handleGuessSubmit}
                  />
              </div>

              <div className="guessCard">
                <p>Guess the last card:</p>
                <input 
                  type="radio"
                  id="lowCardGuess"
                  name="cardGuess"
                  value=""
                />
                <label htmlFor="lowCardGuess">Low: 2 to 6</label>

                <input 
                  type="radio"
                  id="midCardGuess"
                  name="cardGuess"
                  value=""
                />
                <label htmlFor="midCardGuess">Mid: 7 to 9</label>

                <input 
                  type="radio"
                  id="highCardGuess"
                  name="cardGuess"
                  value=""
                />
                <label htmlFor="highCardGuess">High: 10 to Ace</label>
              </div>

              <button onClick={handleGuessSubmit}>Guess</button>
            </form>
            {deck.length === 0 && 
              <button onClick={handleShuffle}>Shuffle</button>
            }
          </>
        }



        <div>
          <p>{count}</p>
        </div>
        
        

        <div className="deck">
          <ol>
          {deck.map((card,index) => (
              <li key={index}>{card.value} - {card.suit}</li>
          ))}
          </ol>
        </div>
      </div>
    </>
  )
}

export default App
