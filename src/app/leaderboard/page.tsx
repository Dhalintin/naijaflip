"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useState } from "react";

const leaderboardData = [
  {
    rank: "01",
    time: "01:55",
    username: "Somto",
    avatar: "/avatars/somto.png",
    medal: "🥇",
    points: 1400,
  },
  {
    rank: "02",
    time: "02:01",
    username: "Inimfon",
    avatar: "/avatars/inimfon.png",
    medal: "🥈",
    points: 1350,
  },
  {
    rank: "03",
    time: "02:15",
    username: "Anayo",
    avatar: "/avatars/anayo.png",
    medal: "🥉",
    points: 1300,
  },
  {
    rank: "04",
    time: "02:30",
    username: "Ejiofor",
    avatar: "/avatars/ejiofor.png",
    medal: "",
    points: 1250,
  },
  {
    rank: "05",
    time: "02:45",
    username: "Sonia",
    avatar: "/avatars/sonia.png",
    medal: "",
    points: 1200,
  },
  {
    rank: "06",
    time: "02:48",
    username: "Onyii bekee",
    avatar: "/avatars/onyii.png",
    medal: "",
    points: 1150,
  },
  {
    rank: "07",
    time: "02:50",
    username: "Prosper",
    avatar: "/avatars/prosper.png",
    medal: "",
    points: 1100,
  },
  {
    rank: "08",
    time: "02:51",
    username: "Uche",
    avatar: "/avatars/uche.png",
    medal: "",
    points: 1050,
  },
  {
    rank: "09",
    time: "02:59",
    username: "Okoro",
    avatar: "/avatars/okoro.png",
    medal: "",
    points: 1000,
  },
  {
    rank: "10",
    time: "03:02",
    username: "Victor",
    avatar: "/avatars/victor.png",
    medal: "",
    points: 950,
  },
  {
    rank: "11",
    time: "03:15",
    username: "Lynda",
    avatar: "/avatars/lynda.png",
    medal: "",
    points: 900,
  },
];

export default function Leaderboard() {
  const username = "Anita";
  const [isOpenDifficulty, setIsOpenDifficulty] = useState<boolean>(false);

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
            <h1 className="text-2xl font-bold text-[#B15A1A] ml-7">
              Leaderboard
            </h1>
          </div>
        </nav>

        <div className="w-screen max-h-full overflow-y-auto px-6 pt-2 pb-6 relative z-10 flex justify-center">
          {/* Table */}
          <div className="w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
              {/* Fixed Header */}
              <div className="sticky top-0 z-10 bg-[#B15A1A] text-white">
                <div className="grid grid-cols-12 px-6 py-4 text-sm font-semibold">
                  <div className="col-span-1 text-center">S/N</div>
                  <div className="col-span-3">TIME</div>
                  <div className="col-span-5">USERNAME</div>
                  <div className="col-span-3 text-right">POINT</div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="max-h-[430px] overflow-y-auto">
                {leaderboardData.map((entry, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-colors items-center text-sm"
                  >
                    {/* Rank */}
                    <div className="col-span-1 text-center font-medium text-amber-700">
                      {entry.rank}
                    </div>

                    {/* Time */}
                    <div className="col-span-3 font-mono text-gray-700">
                      {entry.time}
                    </div>

                    {/* Username + Avatar */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-200 flex-shrink-0">
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800">
                        {entry.username}
                      </span>
                    </div>

                    {/* Medal + Points */}
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      {entry.medal && (
                        <span className="text-xl">{entry.medal}</span>
                      )}
                      <span className="font-semibold text-amber-800 tabular-nums">
                        {entry.points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-20">
          <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            📤 Export
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
            ↗ Share
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
