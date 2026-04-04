"use client";

import { useGameStore } from "@/stores/useGameStore";
import { levels } from "@/utils/levels";
import { useEffect, useState } from "react";

interface EndGameModalProps {
  isOpen: boolean;
  isPaused: boolean;
  onClose: () => void;
  onRestart: () => void;
  onNext: () => void;
  onViewHistory: () => void;
  onHome: () => void;
  pauseGame: () => void;
  currentLevelId: number;
}

export default function EndGameModal({
  isOpen,
  onClose,
  onRestart,
  onNext,
  onViewHistory,
  onHome,
  isPaused,
  pauseGame,
  currentLevelId,
}: EndGameModalProps) {
  const { user } = useGameStore();
  const [userCurrentLevel, setUserCurrentLevel] = useState(1);
  const [currentGameLevel, setCurrentGameLevel] = useState(1);

  useEffect(() => {
    setUserCurrentLevel(user.currentLevel);
    setCurrentGameLevel(currentLevelId);
  }, [user, currentLevelId]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-black font-capriola">
      <div className="w-full max-w-[380px] bg-[#2C1810]/80 rounded-3xl overflow-hidden shadow-2xl border-8 border-[#2C1810]">
        {/* Decorative Top Border */}
        <div className="bg-[#2C1810] py-3 flex items-center justify-center relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#2C1810] font-bold text-xl border-4 border-[#2C1810]">
            ←
          </div>

          <h2 className="text-white text-2xl font-bold tracking-wide">
            End Game
          </h2>

          <div
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#2C1810] font-bold text-xl border-4 border-[#2C1810] cursor-pointer"
          >
            ✕
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-4 ">
          {isPaused && (
            <button
              onClick={pauseGame}
              className="w-full py-4 bg-white border-2 border-[#2C1810] rounded-2xl font-semibold text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition-all active:scale-95"
            >
              Resume
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-4 bg-white border-2 border-[#2C1810] rounded-2xl font-semibold text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition-all active:scale-95"
          >
            Restart
          </button>

          <button
            onClick={onNext}
            disabled={
              userCurrentLevel <= currentGameLevel ||
              currentGameLevel + 1 >= levels.length
            }
            className="w-full py-4 bg-white border-2 border-[#2C1810] rounded-2xl font-semibold text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition-all active:scale-95 disabled:opacity-20"
          >
            Next Level
          </button>

          <button
            onClick={onViewHistory}
            className="w-full py-4 bg-white border-2 border-[#2C1810] rounded-2xl font-semibold text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>View History</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-4 bg-white border-2 border-[#2C1810] rounded-2xl font-semibold text-[#2C1810] hover:bg-[#2C1810] hover:text-white transition-all active:scale-95"
          >
            Home
          </button>
        </div>

        {/* Bottom Decorative Border */}
        <div className="h-4 bg-[#2C1810]"></div>
      </div>
    </div>
  );
}
