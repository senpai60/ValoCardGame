import SelectFirstTurn from "./TurnDecider";

/**
 * Shuffles and deals a deck of cards.
 * @param {Array} cardsData - The original array of all agent cards.
 * @returns {Object} An object containing { PlayerCards, AICards, firstTurn }.
 */
const ShuffleCard = (cardsData) => {
  // 1. Determine who goes first
  const firstTurn = SelectFirstTurn();

  // 2. Create a copy of the cardsData to shuffle
  // We do this so we don't mutate the original 'AllCards' data
  const shuffledDeck = [...cardsData];

  // 3. Shuffle the copied deck using the Fisher-Yates Algorithm
  // This is the standard and most efficient way to shuffle
  let currentIndex = shuffledDeck.length;
  let randomIndex;

  // While there are still cards to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining card
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current card
    [shuffledDeck[currentIndex], shuffledDeck[randomIndex]] = [
      shuffledDeck[randomIndex], shuffledDeck[currentIndex],
    ];
  }

  // 4. Deal the shuffled cards into two hands
  const PlayerCards = [];
  const AICards = [];

  shuffledDeck.forEach((card, index) => {
    // Alternate dealing cards to each hand
    // (index % 2 === 0) means 'if the index is even'
    if (index % 2 === 0) {
      PlayerCards.push(card);
    } else {
      AICards.push(card);
    }
  });

  // 5. Return everything the game needs to start
  return { PlayerCards, AICards, firstTurn };
};

export default ShuffleCard;