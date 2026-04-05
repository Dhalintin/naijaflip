"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface FunfareModalProps {
  isOpen: boolean;
  finalScore: number;
  onClose: () => void;
  onPlayAgain?: () => void;
}

export default function FunfareModal({
  isOpen,
  finalScore,
  onClose,
  onPlayAgain,
}: FunfareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Continuous celebration effects
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simple continuous confetti using canvas-confetti (recommended)
    const launchConfetti = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    };

    // Fireworks + rockets effect
    const fireworks = setInterval(() => {
      launchConfetti();

      // Occasional big burst
      if (Math.random() > 0.7) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: Math.random() * 0.5 },
        });
      }
    }, 2000);

    intervalRef.current = fireworks;

    // Initial big celebration
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.4 },
      });
    }, 300);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      confetti.reset();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[-1]"
      />

      <div className="bg-[#B15A1A] rounded-3xl p-10 max-w-md w-full mx-6 md:mx-4 text-center relative overflow-hidden shadow-2xl flex flex-col justify-center items-center">
        {/* Celebration header */}
        <div className="mb-6">
          <div className="text-4xl md:text-6xl mb-4">🎉🏆🎊</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-capriola">
            Congratulations!
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            You finished NaijaFlip!
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <p className="text-white/80 text-md md:text-lg">Your Final Score</p>
          <p className="text-5xl md:text-6xl font-bold text-white mt-2">
            {finalScore}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="bg-white text-[#B15A1A] font-bold py-4 rounded-2xl text-lg hover:bg-amber-100 transition cursor-pointer"
            >
              Play Again
            </button>
          )}

          <button
            onClick={onClose}
            className="border-2 cursor-pointer border-white/70 text-white font-bold p-4 rounded-2xl text-sm md:text-lg hover:bg-white/10 transition"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Floating celebration emojis
        <div className="absolute -top-4 -right-3 text-6xl animate-bounce">
          🚀
        </div>
        <div className="absolute -bottom-4 -left-4 text-5xl animate-bounce delay-300">
          🎆
        </div> */}
      </div>
    </div>
  );
}
