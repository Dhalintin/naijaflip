// stores/useGameStore.ts
import { updateUserProfile } from "@/lib/firestore";
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
  logout: () => void;
  syncLocalProgressToServer: () => void;
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

      // ====================== Improved Logout ======================
      logout: () => {
        const state = get();

        if (state.user?.uid) {
          const progressToSave = {
            currentLevelId: state.currentLevelId,
            score: state.score, // current session score (if you want to persist unfinished games)
            // You can add more if needed: deactivatedCards, etc.
          };

          localStorage.setItem(
            `gameProgress_${state.user.uid}`,
            JSON.stringify(progressToSave)
          );
        }

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

      // New action: Sync local progress with server (called after login)
      syncLocalProgressToServer: async () => {
        const state = get();
        if (!state.user?.uid) return;

        const savedStr = localStorage.getItem(`gameProgress_${state.user.uid}`);
        if (!savedStr) return;

        try {
          const localProgress = JSON.parse(savedStr);

          // Always keep the HIGHEST values
          const newCurrentLevel = Math.max(
            state.user.currentLevel || 1,
            localProgress.currentLevelId || 1
          );

          const newPoints = Math.max(
            state.user.points || 0,
            (state.user.points || 0) + (localProgress.score || 0)
          );

          if (
            newCurrentLevel > (state.user.currentLevel || 1) ||
            newPoints > (state.user.points || 0)
          ) {
            const newRec = await updateUserProfile({
              uid: state.user.uid,
              updates: {
                currentLevel: newCurrentLevel,
                points: newPoints,
              },
            });

            if (newRec) {
              set({ user: newRec });
            }
          }

          // Optional: clear after successful sync
          // localStorage.removeItem(`gameProgress_${state.user.uid}`);
        } catch (err) {
          console.error("Failed to sync local progress", err);
        }
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
