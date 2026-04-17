/**
 * Takes x random unique items from the cards array,
 * duplicates each item (2x, 4x, or 6x times),
 * shuffles the result, and returns the final game deck.
 */
export function createMemoryDeck(
  cards: any[],
  numUniqueCards: number,
  duplicatesPerCard: 2 | 4 | 6 = 2
): string[] {
  // Step 1: Validate inputs
  if (numUniqueCards <= 0 || numUniqueCards > cards.length) {
    throw new Error(`numUniqueCards must be between 1 and ${cards.length}`);
  }
  if (![2, 4, 6].includes(duplicatesPerCard)) {
    throw new Error("duplicatesPerCard must be 2, 4, or 6");
  }

  // Step 2: Randomly select 'numUniqueCards' unique items from the array
  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
  const selectedUniqueCards = shuffledCards.slice(0, numUniqueCards);

  // Step 3: Create duplicates for each selected card
  const deck: string[] = [];

  for (const card of selectedUniqueCards) {
    for (let i = 0; i < duplicatesPerCard; i++) {
      deck.push(card);
    }
  }

  // Step 4: Shuffle the final deck thoroughly
  const shuffledDeck = shuffleVigorously(deck);
  // for (let i = deck.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [deck[i], deck[j]] = [deck[j], deck[i]];
  // }

  return shuffledDeck;
}

function shuffleVigorously<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let pass = 0; pass < 5; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomFactor =
        Math.floor(Math.random() * (i + 1)) + (Date.now() % (i + 1));

      const j = randomFactor % (i + 1);

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  return shuffled;
}
