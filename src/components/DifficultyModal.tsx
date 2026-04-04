"use client";

import { useGameStore } from "@/stores/useGameStore";
import { useEffect, useState } from "react";

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  currentLevelId?: number; // Optional: to highlight the player's current level
}

const levels = [
  { id: 1, name: "Beginner", totalCards: 6, pairs: 3 },
  { id: 2, name: "Novice", totalCards: 8, pairs: 4 },
  { id: 3, name: "Easy", totalCards: 12, pairs: 6 },
  { id: 4, name: "Medium", totalCards: 16, pairs: 8 },
  { id: 5, name: "Challenging", totalCards: 20, pairs: 10 },
  { id: 6, name: "Hard", totalCards: 24, pairs: 12 },
  { id: 7, name: "Expert", totalCards: 32, pairs: 15 },
  { id: 8, name: "Master", totalCards: 36, pairs: 18 },
  { id: 9, name: "Legend", totalCards: 40, pairs: 21 },
  { id: 10, name: "Dominator", totalCards: 48, pairs: 24 },
  { id: 11, name: "God Mode", totalCards: 52, pairs: 25 },
];

export default function DifficultyModal({
  isOpen,
  onClose,
  onSelectLevel,
  currentLevelId = 1,
}: DifficultyModalProps) {
  const { user } = useGameStore();
  const [curLevel, setCurLevel] = useState(1);

  useEffect(() => {
    if (user?.currentLevel) setCurLevel(user?.currentLevel);
  }, [user]);

  const handleSelectLevel = (id: number) => {
    onSelectLevel(id);
    if (curLevel >= id) {
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-black font-capriola">
      <div className="absolute inset-0 " onClick={onClose} />
      <div className="w-full max-w-[420px] bg-white/20 rounded-3xl overflow-hidden shadow-2xl border-8 border-[#2C1810] z-10">
        {/* Header */}
        <div className="bg-[#2C1810] py-5 flex items-center justify-center relative">
          <h2 className="text-white text-2xl font-bold tracking-wide">
            Choose Difficulty
          </h2>
          <button
            onClick={onClose}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-amber-300 transition"
          >
            ✕
          </button>
        </div>

        {/* Levels Grid */}
        <div className="p-6 bg-[#2C1810]/95 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleSelectLevel(level.id)}
                disabled={curLevel < level.id}
                className={`w-full p-3 rounded-2xl border-2 transition-all flex justify-between items-center group relative overflow-hidden text-xs md:text-md ${
                  curLevel === level.id
                    ? "border-[#2C1810] bg-white shadow-md"
                    : "border-transparent hover:border-amber-700 bg-white/70"
                } ${
                  curLevel >= level.id
                    ? "hover:bg-white cursor-pointer"
                    : "opacity-75 cursor-not-allowed"
                }`}
              >
                {/* Lock Sticker - Only shows when level is locked */}
                {curLevel < level.id && (
                  <div className="absolute -top-2 -right-1 text-sm bg-white w-7 h-8 flex items-center justify-center rounded-full z-10">
                    🔒
                  </div>
                )}

                <div className="text-left">
                  <div className="font-bold text-lg text-[#2C1810]">
                    {level.name}
                  </div>
                </div>

                <div className="text-amber-600 font-medium text-sm px-4 py-1 text-right">
                  <div className="text-xs md:text-sm text-gray-600">
                    {level.totalCards} cards • {level.pairs} pairs
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#2C1810] h-4"></div>
      </div>
    </div>
  );
}
