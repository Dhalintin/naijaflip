// stores/useGameStore.ts
import { allCards } from "@/utils/allCards";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  uid?: string;
  email: string;
  displayName: string;
  userImage: string;
  currentLevel: number;
}

interface CardType {
  id: string;
  img: string;
}

interface FlippedCardsType {
  index: number;
  cardId: string;
}

interface GameState {
  // User Profile
  user: any;
  // User | null;
  setUser: (user: any) => void;
  updateUser: (state: any, update: any) => void;

  // Game Settings
  currentLevelId: number;
  setCurrentLevelId: (id: number) => void;

  // Game Data
  cards: CardType[];
  flippedCards: FlippedCardsType[];
  deactivatedCards: number[];
  score: number;
  remainingTime: number;
  isPaused: boolean;
  isGameStarted: boolean;
  isGameFinished: boolean;
  isGameWon: boolean;
  setIsGameWon: (isWon: boolean) => void;

  // Actions
  setTimeLimit: (seconds: number) => void;
  flipCard: (index: number, card: CardType) => void;
  decrementTime: () => void;
  startGame: (time: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (reason: "win" | "time-up" | "manual") => void;
  resetCurrentGame: () => void;
  checkWinCondition: () => void;
  logout: () => void; // ← NEW: Logout action
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: null,
      currentLevelId: 1,
      cards: allCards,
      flippedCards: [],
      deactivatedCards: [],
      score: 0,
      remainingTime: 0,
      isPaused: false,
      isGameStarted: false,
      isGameFinished: false,
      isGameWon: false,

      setUser: (user) =>
        set({
          user,
        }),

      updateUser: (state, update: any) =>
        set({
          user: { ...state.user, ...update },
        }),

      setCurrentLevelId: (id) => set({ currentLevelId: id }),

      setTimeLimit: (seconds) =>
        set({ remainingTime: seconds, isPaused: false }),

      decrementTime: () =>
        set((state) => {
          if (state.isPaused || state.remainingTime <= 0) return state;

          const newTime = state.remainingTime - 1;

          if (newTime <= 0) {
            get().endGame("time-up");
            return { remainingTime: 0 };
          }

          return { remainingTime: newTime };
        }),

      pauseGame: () => set((state) => ({ isPaused: !state.isPaused })),
      resumeGame: () => set({ isPaused: false }),

      startGame: (timeLimit: number) =>
        set((state) => ({
          remainingTime: timeLimit,
          isPaused: false,
          isGameStarted: true,
          isGameFinished: false,
          isGameWon: false,
        })),

      setIsGameWon: (won: any) => set({ isGameWon: won }),

      endGame: (reason) => {
        console.log(
          `🎮 Game ended → Reason: ${reason} | Score: ${get().score}`
        );

        set({
          isGameFinished: true,
          isGameStarted: false,
          isPaused: false,
          isGameWon: reason === "win",
        });
      },

      checkWinCondition: () => {
        const state = get();
        const totalCards = state.cards.length;
        const matchedCount = state.deactivatedCards.length;

        if (matchedCount === totalCards && !state.isGameFinished) {
          get().endGame("win");
        }
      },

      flipCard: (index: number, card: CardType) =>
        set((state) => {
          if (
            state.flippedCards.some((fc) => fc.index === index) ||
            state.deactivatedCards.includes(index) ||
            state.flippedCards.length >= 2
          ) {
            return state;
          }

          const newFlipped = [
            ...state.flippedCards,
            { index, cardId: card.id },
          ];

          if (newFlipped.length === 1) {
            return {
              flippedCards: newFlipped,
            };
          }

          if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            const isMatch = first.cardId === second.cardId;

            if (isMatch) {
              setTimeout(() => {
                set((current) => {
                  const isAllMatched =
                    current.deactivatedCards.length + 2 ===
                    current.cards.length;

                  const newState = {
                    flippedCards: current.flippedCards.filter(
                      (fc) =>
                        fc.index !== first.index && fc.index !== second.index
                    ),
                    deactivatedCards: [
                      ...current.deactivatedCards,
                      first.index,
                      second.index,
                    ],
                    score: current.score + 10,
                  };

                  return newState;
                });
              }, 1000);

              return { flippedCards: newFlipped };
            } else {
              setTimeout(() => {
                set((current) => ({
                  flippedCards: current.flippedCards.filter(
                    (fc) =>
                      fc.index !== first.index && fc.index !== second.index
                  ),
                }));
              }, 500);

              return {
                flippedCards: newFlipped,
                score: Math.max(0, state.score - 1),
              };
            }
          }

          return state;
        }),

      resetCurrentGame: () =>
        set({
          flippedCards: [],
          deactivatedCards: [],
          score: 0,
          isPaused: false,
          isGameStarted: false,
          isGameFinished: false,
          isGameWon: false,
        }),

      // ====================== NEW: Logout Function ======================
      // logout: () => {
      //   set({
      //     user: null,
      //     currentLevelId: 1,
      //     flippedCards: [],
      //     deactivatedCards: [],
      //     score: 0,
      //     remainingTime: 0,
      //     isPaused: false,
      //     isGameStarted: false,
      //     isGameFinished: false,
      //     isGameWon: false,
      //   });
      // },

      logout: () => {
        const currentState = get(); // or use the store's get() if you're inside create((set, get) => ...)

        // Only save if there's a logged-in user
        if (currentState.user) {
          const dataToSave = {
            user: currentState.user,
          };

          // Key it by user UID so it's user-specific (prevents mixing data between accounts)
          localStorage.setItem(
            `gameProgress_${currentState.user.uid}`,
            JSON.stringify(dataToSave)
          );
        }

        // Now clear the Zustand state (reset to defaults)
        set({
          user: null,
          currentLevelId: 1,
          flippedCards: [],
          deactivatedCards: [],
          score: 0,
          remainingTime: 0,
          isPaused: false,
          isGameStarted: false,
          isGameFinished: false,
          isGameWon: false,
        });
      },
    }),

    {
      name: "naijaflip-storage",
      partialize: (state) => ({
        user: state.user,
        currentLevelId: state.currentLevelId,
      }),
    }
  )
);

// // stores/useGameStore.ts
// import { allCards } from "@/utils/allCards";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface User {
//   name: string;
//   uid?: string;
//   email: string;
//   displayName: string;
//   photoURL: string;
// }

// interface CardType {
//   id: string;
//   img: string;
// }

// interface FlippedCardsType {
//   index: number;
//   cardId: string;
// }

// interface GameState {
//   // User Profile
//   user: User | null;
//   setUser: (user: any) => void;

//   // Game Settings
//   currentLevelId: number;
//   setCurrentLevelId: (id: number) => void;

//   // Game Data
//   cards: CardType[];
//   flippedCards: FlippedCardsType[];
//   deactivatedCards: number[];
//   score: number;
//   remainingTime: number; // ← Countdown timer
//   isPaused: boolean; // ← For pause modal
//   isGameStarted: boolean;
//   isGameFinished: boolean;

//   isGameWon: boolean; // ← NEW
//   setIsGameWon: (won: boolean) => void; // ← NEW

//   // Actions
//   setTimeLimit: (seconds: number) => void;
//   flipCard: (index: number, card: CardType) => void;
//   decrementTime: () => void;
//   startGame: (time: number) => void;
//   pauseGame: () => void;
//   resumeGame: () => void;
//   endGame: (reason: "win" | "time-up" | "manual") => void;
//   resetCurrentGame: () => void;
//   checkWinCondition: () => void;
// }

// export const useGameStore = create<GameState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       currentLevelId: 1,
//       cards: allCards,
//       flippedCards: [],
//       deactivatedCards: [],
//       score: 0,
//       remainingTime: 0,
//       isPaused: false,
//       isGameStarted: false,
//       isGameFinished: false,
//       isGameWon: false,

//       setUser: (user) =>
//         set({
//           user: {
//             uid: user.uid,
//             email: user.email,
//             name: user.displayName,
//             displayName: user.displayName,
//             photoURL: user.photoURL,
//           },
//         }),

//       setCurrentLevelId: (id) => set({ currentLevelId: id }),

//       // New: Set timer when level starts
//       setTimeLimit: (seconds) =>
//         set({ remainingTime: seconds, isPaused: false }),

//       // New: Countdown every second
//       decrementTime: () =>
//         set((state) => {
//           if (state.isPaused || state.remainingTime <= 0) return state;

//           const newTime = state.remainingTime - 1;

//           if (newTime <= 0) {
//             get().endGame("time-up");
//             return { remainingTime: 0 };
//           }

//           return { remainingTime: newTime };
//         }),

//       // New: Pause / Resume
//       pauseGame: () => set((state) => ({ isPaused: !state.isPaused })),
//       resumeGame: () => set({ isPaused: false }),
//       startGame: (timeLimit: number) =>
//         set((state) => ({
//           //   cards: allCards, // or shuffled version
//           //   flippedCards: [],
//           //   deactivatedCards: [],
//           //   score: 0,
//           remainingTime: timeLimit,
//           isPaused: false,
//           isGameStarted: true,
//           isGameFinished: false,
//         })),

//       setIsGameWon: (won) => set({ isGameWon: won }),

//       // New: End game (win, lose, or manual) + save to DB + reset
//       endGame: (reason) => {
//         // TODO: Call your Firestore function here to save game history
//         console.log(
//           `🎮 Game ended → Reason: ${reason} | Score: ${get().score}`
//         );

//         // Save to DB would go here (example placeholder)
//         // saveGameToHistory(get().user?.uid, get().currentLevelId, get().score, reason);

//         set({
//           isGameFinished: true,
//           isGameStarted: false,
//           isPaused: false,
//           isGameWon: reason === "win",
//         });

//         // Reset after a tiny delay so UI can show end screen
//         // setTimeout(() => {
//         //   get().resetCurrentGame();
//         // }, 300);
//       },

//       checkWinCondition: () => {
//         const state = get();
//         const totalCards = state.cards.length;
//         const matchedCount = state.deactivatedCards.length;

//         if (matchedCount === totalCards && !state.isGameFinished) {
//           get().endGame("win");
//         }
//       },

//       flipCard: (index: number, card: CardType) =>
//         set((state) => {
//           if (
//             state.flippedCards.some((fc) => fc.index === index) ||
//             state.deactivatedCards.includes(index) ||
//             state.flippedCards.length >= 2
//           ) {
//             return state;
//           }

//           const newFlipped = [
//             ...state.flippedCards,
//             { index, cardId: card.id },
//           ];

//           if (newFlipped.length === 1) {
//             return {
//               flippedCards: newFlipped,
//               score: Math.max(0, state.score - 1),
//             };
//           }

//           if (newFlipped.length === 2) {
//             const [first, second] = newFlipped;
//             const isMatch = first.cardId === second.cardId;

//             if (isMatch) {
//               // Match → show for 1 second then deactivate
//               setTimeout(() => {
//                 set((current) => {
//                   const isAllMatched =
//                     current.deactivatedCards.length + 2 ===
//                     current.cards.length;

//                   const newState = {
//                     flippedCards: current.flippedCards.filter(
//                       (fc) =>
//                         fc.index !== first.index && fc.index !== second.index
//                     ),
//                     deactivatedCards: [
//                       ...current.deactivatedCards,
//                       first.index,
//                       second.index,
//                     ],
//                     score: current.score + 5,
//                   };

//                   // Auto win if all cards are matched
//                   if (isAllMatched) {
//                     get().endGame("win");
//                   }

//                   return newState;
//                 });
//               }, 1000);

//               return { flippedCards: newFlipped };
//             } else {
//               // No match → flip back after 500ms
//               setTimeout(() => {
//                 set((current) => ({
//                   flippedCards: current.flippedCards.filter(
//                     (fc) =>
//                       fc.index !== first.index && fc.index !== second.index
//                   ),
//                 }));
//               }, 500);

//               return { flippedCards: newFlipped };
//             }
//           }

//           return state;
//         }),

//       resetCurrentGame: () =>
//         set({
//           flippedCards: [],
//           deactivatedCards: [],
//           score: 0,
//           //   remainingTime: 0,
//           isPaused: false,
//           isGameStarted: false,
//           isGameFinished: false,
//           isGameWon: false,
//         }),
//     }),

//     {
//       name: "naijaflip-storage",
//       partialize: (state) => ({
//         user: state.user,
//         currentLevelId: state.currentLevelId,
//       }),
//     }
//   )
// );
