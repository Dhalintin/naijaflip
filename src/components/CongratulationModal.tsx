"use client";

import { useRouter } from "next/navigation";

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalScore: number;
  score: number;
  onNext: () => void;
  playAgain: () => void;
  handleReturn: () => void;
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

export default function CongratulationModal({
  isOpen,
  onClose,
  score,
  onNext,
  playAgain,
  handleReturn,
  totalScore,
}: DifficultyModalProps) {
  if (!isOpen) return null;
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-capriola text-black">
      <div className="absolute inset-0 " onClick={onClose} />
      <div className="w-full max-w-5/6 md:max-w-[420px] h-62 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#B15A1A]/10 z-10 bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col justify-between items-center gap-2 min-h-40">
          <p className="text-[#B15A1A] font-bold text-md md:text-lg">
            Congratulations
          </p>
          <div className="flex flex-col items-center text-sm">
            <p>You earned {score} points</p>
            <p>
              Total Score:{" "}
              <span className="text-[#B15A1A] font-semibold">{totalScore}</span>
            </p>
          </div>
          <div className="space-x-3 md:space-x-8">
            <button
              onClick={playAgain}
              className="text-sm md:text-md px-3 md:px-5 py-1 bg-[#B15A1A] text-white font-light rounded-lg hover:bg-[#B15A1A]"
            >
              Play Again
            </button>
            <button
              onClick={onNext}
              className="border border-[#B15A1A] text-[#B15A1A] font-semibold rounded-lg text-sm md:text-md px-3 md:px-5 py-1 hover:bg-[#B15A1A]/90 hover:text-white"
            >
              Next
            </button>
            <button
              onClick={handleReturn}
              className="text-sm md:text-md px-3 md:px-5 py-1 bg-[#B15A1A] text-white font-light rounded-lg hover:bg-[#B15A1A]"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
