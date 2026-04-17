"use client";

import { useGameStore } from "@/stores/useGameStore";
import { createMemoryDeck } from "@/utils/create-deck";
import { formatTime } from "@/utils/format";
import { levels } from "@/utils/levels";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import EndGameModal from "@/components/EndGameModal";
import CongratulationModal from "@/components/CongratulationModal";
import { shuffle } from "@/utils/shuffle";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  createOrUpdateUser,
  saveGameResult,
  updateUserProfile,
} from "@/lib/firestore";
import ConfirmationModal from "@/components/ConfirmationModal";
import { gameGrid } from "@/utils/gridStyle";
import FunFactModal from "@/components/FunFactModal";
import { funfact } from "@/utils/fun-facts";
import FunfareModal from "@/components/Funfare";

export default function GamePage() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressUpdated, setProgressUpdated] = useState<boolean>(false);
  const [progressStoreError, setProgressStoreError] = useState<string | null>(
    null
  );
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const router = useRouter();

  const {
    currentLevelId,
    flippedCards,
    score,
    flipCard,
    deactivatedCards,
    cards,
    setTimeLimit,
    remainingTime,
    startGame,
    isPaused,
    isGameStarted,
    isGameFinished,
    pauseGame,
    endGame,
    resetCurrentGame,
    isGameWon,
    setCurrentLevelId,
    setIsGameWon,
    user,
    setUser,
  } = useGameStore();

  const [det, setDet] = useState(levels[currentLevelId - 1]);
  const [currlvl, setCurrLvl] = useState<number>(currentLevelId - 1);

  const [deck, setDeck] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [countDown, setCountDown] = useState<number | null>(null);

  // Initialize deck and start the game
  useEffect(() => {
    if (!det || !det.pairs) return;

    const newDeck = createMemoryDeck(cards, det.pairs, det.duplicates);
    setDeck(newDeck);

    setCountDown(4);
    setTimeout(() => {
      setTimeLimit(det.time);
      startGame(det.time);
      const reveal = Array.from({ length: newDeck.length }, (_, i) => i);
      setRevealedCards(reveal);
      setCurrentLevelId(det.id);
    }, 5000);
  }, [det, cards, startGame, setTimeLimit]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown === 0) {
        setCountDown(null);
      } else {
        if (countDown !== null) setCountDown(countDown - 1);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [countDown]);

  useEffect(() => {
    if (!isGameStarted || isGameFinished || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const newTime = remainingTime - 1;

      if (newTime <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        endGame("time-up");
      } else {
        setTimeLimit(newTime);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    isGameStarted,
    isPaused,
    isGameFinished,
    remainingTime,
    endGame,
    setTimeLimit,
    currentLevelId,
  ]);

  const updateLocal = (newRec: any) => {
    setUser({ ...user, ...newRec });
  };

  useEffect(() => {
    const recordWin = async () => {
      // === GUARDS ===
      if (deck.length === 0) return;
      if (deactivatedCards.length !== deck.length) return;
      if (!user?.uid) {
        console.warn("User not ready yet - skipping save");
        return;
      }
      if (isGameFinished || isGameWon) return;

      console.log(
        `✅ All cards matched on level ${currentLevelId}. Saving progress...`
      );

      setIsLoading(true);
      setProgressStoreError(null);

      try {
        // Mark game as won immediately
        endGame("win");

        // 1. Save game result
        await saveGameResult({
          userId: user.uid, // Safe because we checked above
          gameLevel: currentLevelId,
          score: score,
          status: "won", // Hardcoded - we know it's a win
          timeTaken: det.time - remainingTime,
        });

        // 2. Update user profile
        const newRec = await updateUserProfile({
          uid: user.uid,
          updates: {
            currentLevel: Math.max(user.currentLevel || 1, currentLevelId + 1),
            points: (user?.points || 0) + score,
          },
        });

        if (newRec) {
          updateLocal(newRec);
        }

        setProgressUpdated(true);
        console.log("Progress saved successfully");
      } catch (err: any) {
        console.error("❌ Failed to save win progress:", err);

        setProgressUpdated(false);

        let errorMessage =
          "Problem storing progress.<br />Check your internet connection.<br />Your progress may not have been saved!";

        if (err.code === "permission-denied") {
          errorMessage =
            "Permission error. Please make sure you are logged in.";
        } else if (err.message?.includes("uid")) {
          errorMessage = "User session error. Please try logging in again.";
        }

        setProgressStoreError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    recordWin();
  }, [
    deactivatedCards,
    deck.length,
    user?.uid,
    isGameFinished,
    isGameWon,
    currentLevelId,
    score,
    remainingTime,
    det?.time,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePause = () => {
    pauseGame();
  };

  const handleRestart = () => {
    console.log("Restarting...");
    resetCurrentGame();
    setTimeout(() => {
      const newDeck = shuffle(deck);
      setDeck(newDeck);
      startGame(det.time);
      const reveal = Array.from({ length: newDeck.length }, (_, i) => i);
      setRevealedCards(reveal);
    }, 1000);
  };

  const handleClose = () => {
    if (isPaused) {
      pauseGame();
    } else {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    setOpenModal((isGameFinished || isPaused) && !isGameWon);
  }, [isGameFinished, isPaused]);

  // Reset and load new level properly
  const loadLevel = (levelId: number) => {
    setCurrentLevelId(levelId);

    // Important: Reset all game state before loading new level
    resetCurrentGame();
    setIsGameWon(false);
    setOpenModal(false);
    setDeck([]);

    setTimeout(() => {
      // const newDeck = createMemoryDeck(cards, levels[levelId - 1].pairs, 2);
      // setDeck(newDeck);
      setDet(levels[levelId - 1]);
      setTimeLimit(levels[levelId - 1].time);
      // startGame(levels[levelId].time);
      setCurrLvl(levelId - 1);
    }, 1000);
  };

  const handleReturn = () => {
    resetCurrentGame();
    router.push("/dashboard");
  };

  const handleReturnHome = () => {
    // pauseGame();
    setOpenConfirmationModal(true);
  };

  useEffect(() => {
    setTimeout(() => {
      if (progressStoreError) setProgressStoreError(null);
    }, 5000);
  }, [progressStoreError]);

  useEffect(() => {
    setTimeout(() => {
      if (revealedCards.length > 0) setRevealedCards([]);
    }, levels[currlvl].reveaDuration);
  }, [revealedCards]);

  const handleLoadNext = () => {
    loadLevel(currentLevelId + 1);
  };

  const [showFact, setShowFact] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [fact, setFact] = useState({ img: "", fact: "" });

  const viewFunFact = (action: () => void) => {
    setPendingAction(() => action);
    setShowFact(true);
    setFact(funfact[Math.floor(Math.random() * (funfact.length + 1))]);
  };

  const handleContinue = () => {
    setShowFact(false);

    setTimeout(() => {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }, 300);
  };

  const returnToDash = () => {
    console.log("Returning to dashboard...");
    router.push("/dashboard");
  };

  const [stayOpen, setStayOpen] = useState(false);

  // const handleSetting = () => {
  //   if (!isGameFinished) {
  //     pauseGame();
  //   } else {
  //     setOpenModal(true);
  //   }
  // };

  return (
    <ProtectedRoute>
      <div
        className="h-screen bg-cover bg-center relative font-sans overflow-hidden text-black font-capriola"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
        <div className="absolute inset-0 bg-gray-400/90" />
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
            countDown
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-center">
            <div className="text-white text-[180px] font-bold animate-pulse leading-none">
              {countDown}
            </div>
            <p className="text-white/70 text-2xl mt-4 font-medium tracking-widest">
              GET READY...
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-between items-between h-screen max-w-screen mx-auto px-4 pb-1 pt-6">
          {progressStoreError && (
            <div className="absolute right-0 top-8 w-48 p-2 rounded-md bg-amber-50/90 text-black z-[12] text-xs md:text-md text-red-600">
              {progressStoreError}
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 md:gap-4">
              <button
                onClick={handleReturnHome}
                className="w-6 h-6 md:w-8 md:h-8 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition"
              >
                <img src="/images/home.png" alt="" className="w-5 md:w-6" />
              </button>
            </div>

            <div className="flex gap-1 md:gap-3 text-sm">
              <div className="bg-white/90 backdrop-blur-md px-3 md:px-6 py-1 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shadow-sm">
                <span className="rounded-full bg-[#FFB479] w-4 h-4 md:w-6 md:h-6 flex justify-center items-center">
                  <img
                    src="/images/level.png"
                    alt=""
                    className="w-3 h-2 md:w-4 md:h-3"
                  />
                </span>
                <span className="font-semibold text-gray-800 text-xs md:text-md">
                  Level {det.id}: {det.name}
                </span>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-3 md:px-6 py-1 md:py-2 rounded-full flex items-center gap-2 shadow-sm">
                <span className="rounded-full bg-[#FFB479] w-4 h-4 md:w-6 md:h-6 flex justify-center items-center">
                  <img src="/images/star.png" alt="" className="w-3 md:w-4" />
                </span>
                <span className="font-semibold text-gray-800 text-xs md:text-md">
                  Score: {score}
                </span>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-3 md:px-6 py-1 md:py-2 rounded-full flex items-center gap-2 shadow-sm">
                <span className="rounded-full bg-[#FFB479] w-6 h-6 flex justify-center items-center">
                  <img src="/images/clock.png" alt="" className="w-3 md:w-4" />
                </span>
                <span className="font-semibold text-gray-800 text-xs md:text-md">
                  Time: {formatTime(remainingTime)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3"></div>
          </div>

          {/* Game Grid */}
          <div className="flex-1 flex items-center justify-center py-1 min-h-0">
            <div className={gameGrid[det.id - 1].outter}>
              {deck.map((item: any, index) => {
                const isFlipped = flippedCards.some((fc) => fc.index === index);
                const isDeactivated = deactivatedCards.includes(index);
                const isRevealed = revealedCards.includes(index);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (isDeactivated || isPaused || isGameFinished) return;
                      flipCard(index, item);
                    }}
                    className={` relative mx-auto aspect-[3/4] cursor-pointer perspective-1000 group ${
                      isDeactivated ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`${gameGrid[det.id - 1].inner} ${
                        isFlipped || isDeactivated || isRevealed
                          ? "rotate-y-180"
                          : ""
                      }`}
                    >
                      {/* Back Side */}
                      <div className="absolute inset-0 backface-hidden">
                        <img
                          src="/images/Card.png"
                          alt="Card Back"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      {/* Front Side */}
                      <div className="absolute inset-0 rotate-y-180 backface-hidden">
                        <img
                          src={`/images/game-pic/${item.img}`}
                          alt={item}
                          className={`w-full h-full object-contain rounded-xl shadow-sm transition-all duration-100 ${
                            isDeactivated ? "blur-[1px] opacity-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-center gap-4 pt-6 pb-2 flex-shrink-0">
            <button
              onClick={handlePause}
              className="px-10 py-3 border border-[#B15A1A] text-[#B15A1A] font-bold text-xs md:text-sm rounded-2xl shadow hover:bg-[#B15A1A] hover:text-white transition bg-amber-50/60"
            >
              {isPaused ? "Resume Game" : "Pause Game"}
            </button>

            <button
              onClick={handleRestart}
              className="px-10 py-3 border border-[#B15A1A] text-[#B15A1A] font-bold text-xs md:text-sm rounded-2xl shadow hover:bg-[#B15A1A] hover:text-white transition bg-amber-50/60"
            >
              Restart Game
            </button>
          </div>
        </div>
        <EndGameModal
          isOpen={openModal}
          isPaused={isPaused}
          pauseGame={handlePause}
          onClose={handleClose}
          onRestart={handleRestart}
          onNext={() => loadLevel(currentLevelId + 1)}
          onViewHistory={() => router.push("/history")}
          onHome={() => router.push("/dashboard")}
          currentLevelId={currentLevelId}
        />

        <CongratulationModal
          isOpen={isGameWon && currentLevelId !== levels.length}
          onClose={() => {}}
          score={score}
          onNext={() => viewFunFact(handleLoadNext)}
          playAgain={() => viewFunFact(handleRestart)}
          handleReturn={() => viewFunFact(handleReturn)}
          totalScore={user?.points + score}
        />

        <ConfirmationModal
          isOpen={openConfirmationModal}
          onClose={() => setOpenConfirmationModal(!openConfirmationModal)}
          onConfirm={handleReturn}
        />

        <FunFactModal isOpen={showFact} onClose={handleContinue} fact={fact} />
        <FunfareModal
          isOpen={isGameWon && currentLevelId == levels.length}
          finalScore={(user?.points || 0) + score}
          onClose={() => viewFunFact(returnToDash)}
          onPlayAgain={() => viewFunFact(handleRestart)}
        />
      </div>
    </ProtectedRoute>
  );
}
