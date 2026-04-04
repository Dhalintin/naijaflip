"use client";

import { useRouter } from "next/navigation";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-capriola text-black">
      <div className="absolute inset-0 " onClick={onClose} />
      <div className="w-full max-w-[420px] h-62 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#B15A1A]/10 z-10 bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col justify-between items-center gap-2 min-h-40">
          <p className="text-[#B15A1A] font-bold text-lg">Close Game</p>
          <div className="flex flex-col items-center">
            <p>Do you want to close and return home?</p>
          </div>
          <div className="space-x-8">
            <button
              onClick={onConfirm}
              className="px-5 py-1 bg-[#B15A1A] text-white font-light rounded-lg hover:bg-[#B15A1A]"
            >
              Yes, Close
            </button>
            <button
              onClick={onClose}
              className="border border-[#B15A1A] text-[#B15A1A] font-semibold rounded-lg px-5 py-1 hover:bg-[#B15A1A]/90 hover:text-white"
            >
              No, ignore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
