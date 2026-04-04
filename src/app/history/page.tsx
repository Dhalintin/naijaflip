"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { getUserGameHistory } from "@/lib/firestore";
import { useGameStore } from "@/stores/useGameStore";
import { formatToYYYYMMDD } from "@/utils/format";
import { levels } from "@/utils/levels";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function GameHistory() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);

  const { user } = useGameStore();

  useEffect(() => {
    const getHistory = async () => {
      setIsLoading(true);
      if (user) {
        const history = await getUserGameHistory(user.uid);

        setHistory(history);
      }
      setIsLoading(false);
    };
    getHistory();
  }, [user]);

  const play = (id: number) => {
    alert("Redirecting to game play on level " + id);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f1e3] font-sans relative overflow-hidden text-black">
        {/* Very Faint Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />

        {/* Optional subtle overlay to further soften the background */}
        <div className="absolute inset-0 bg-[#f8f1e3]/70 pointer-events-none" />

        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 pt-5 backdrop-blur-xs z-50 ">
          <div className="flex items-center gap-3">
            <a href="/dashboard">
              <img src="/images/home.png" alt="logo" className="w-6" />
            </a>
            <h1 className="text-2xl font-bold text-gray-800 ml-7">
              Game History
            </h1>
          </div>
          <div className="flex items-center justify-between mb-2">
            {/* <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Sort By</span>
              <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-600">
                <option value="date">Date (Newest)</option>
                <option value="score">Score (Highest)</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div> */}
          </div>
        </nav>

        <div className="w-screen max-h-full overflow-y-auto px-6 pt-2 pb-6 relative z-10 flex justify-center">
          {/* Table */}
          <div className="rounded-2xl border border-amber-200 shadow-sm overflow-hidden  md:w-5xl">
            <div className="max-h-[480px] overflow-auto">
              <table className="w-full text-sm md:text-md md:text-md md:min-w-[700px]">
                {/* Fixed Header */}
                <thead className="sticky top-0 z-20 bg-amber-700 text-white">
                  <tr>
                    <th className="px-3 md:px-6 py-4 text-left font-semibold whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-3 md:px-6 py-4 text-left font-semibold whitespace-nowrap">
                      level
                    </th>
                    <th className="px-3 md:px-6 py-4 text-left font-semibold whitespace-nowrap">
                      Score
                    </th>
                    <th className="px-3 md:px-6 py-4 text-left font-semibold whitespace-nowrap">
                      Time
                    </th>
                  </tr>
                </thead>

                {/* Scrollable Body */}
                <tbody className="divide-y divide-amber-100  mt-16">
                  {isLoading ? (
                    <tr>
                      <td colSpan={999} className="h-[400px]">
                        <div className="flex items-center justify-center h-full w-full">
                          <Loader className="animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    history.length > 0 &&
                    history?.map((game, index) => (
                      <tr
                        key={index}
                        className="hover:bg-amber-50/60 transition-colors"
                      >
                        <td className="px-2 md:px-6 py-5 text-gray-700 font-medium whitespace-nowrap">
                          {formatToYYYYMMDD(game.playedAt)}
                        </td>
                        <td className="px-2 md:px-6 py-5 whitespace-nowrap">
                          <span
                            className={`inline-block px-4 py-1 rounded-full font-medium`}
                          >
                            {levels[game?.gameLevel]?.name || "Beginner"}
                          </span>
                        </td>
                        <td className="px-2 md:px-6 py-5 font-semibold text-gray-800 whitespace-nowrap">
                          {game.score}
                        </td>
                        <td className="px-2 md:px-6 py-5 font-semibold text-gray-600 font-mono whitespace-nowrap">
                          {game.timeTaken}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-20">
          {/* <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            📤 Export
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            ↗ Share
          </button> */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
