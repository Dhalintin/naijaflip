/**
 * Fisher-Yates Shuffle - Most efficient and unbiased shuffle algorithm
 * Returns a new shuffled array without modifying the original
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a shallow copy

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Optional: In-place shuffle (modifies original array)
 * Use this only if you don't need to preserve the original
 */
export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
