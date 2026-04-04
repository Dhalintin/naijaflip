/**
 * Takes x random unique items from the cards array,
 * duplicates each item (2x, 4x, or 6x times),
 * shuffles the result, and returns the final game deck.
 */
export function createMemoryDeck(
  cards: any[], // Array of card identifiers (e.g. image names or IDs)
  numUniqueCards: number, // How many different cards to pick (e.g. 6, 9, 12)
  duplicatesPerCard: 2 | 4 | 6 = 2 // How many times to duplicate each card
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
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
