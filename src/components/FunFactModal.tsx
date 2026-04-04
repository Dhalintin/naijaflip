"use client";

import { funfact } from "@/utils/fun-facts";
import { useEffect, useState } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fact: { img: string; fact: string };
}

export default function FunFactModal({
  isOpen,
  onClose,
  fact,
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  // const [fact, setFact] = useState({ img: "", fact: "" });
  // useEffect(() => {
  //   setFact(funfact[Math.floor(Math.random() * (funfact.length + 1))]);
  // }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-capriola text-black">
      {/* onClick={onClose} */}
      <div className="absolute inset-0 " />
      <div className="w-full md:max-w-[500px] max-w-[420px] min-h-84 bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#B15A1A]/10 z-10 bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col justify-between items-center gap-2">
          <img
            src={`/images/funfacts/${fact.img}`}
            alt={fact.img}
            className="max-w-40 max-h-40 rounded-lg"
          />
          <p className="text-xs text-md text-[#2C1810] p-3">{fact.fact}</p>
          <button
            onClick={onClose}
            className="bg-[#B15A1A] px-3 py-2 text-sm md:text-md text-white font-bold rounded-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
