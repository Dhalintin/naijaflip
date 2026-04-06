"use client";

import DifficultyModal from "@/components/DifficultyModal";
import LogoutModal from "@/components/LogoutModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useGameStore } from "@/stores/useGameStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [username, setUserName] = useState("User");
  const [image, setImage] = useState<string | null>(null);

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isOpenDifficulty, setIsOpenDifficulty] = useState<boolean>(false);
  const router = useRouter();
  const { user, setCurrentLevelId, logout } = useGameStore();

  const toggleMenu = () => setShowLogoutMenu(!showLogoutMenu);

  useEffect(() => {
    if (user && user.username) {
      const n = user?.username.split(" ")[0] || user?.username;
      setImage(user?.userImage ?? null);
      if (n) {
        setUserName(n);
      }
    }
  }, [user]);

  const play = (id: number) => {
    setCurrentLevelId(id);
    router.push("/game");
  };
  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <ProtectedRoute>
      <div className="h-screen max-w-screen  bg-[#f8f1e3] font-sans relative overflow-hidden text-black font-capriola">
        {/* Very Faint Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />

        {/* Optional subtle overlay to further soften the background */}
        <div className="absolute inset-0 bg-[#f8f1e3]/70 pointer-events-none" />

        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-xs z-50 ">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="logo" className="w-[80%] h-full" />
          </div>

          <div className="flex gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black">
              {/* <Link href="#" className="hover:text-amber-600 transition">
              Home
            </Link>
             
            <Link href="#" className="hover:text-amber-600 transition">
              Cards
            </Link>*/}
              <Link
                href="/tutorial"
                className="hover:text-amber-600 transition underline"
              >
                Tutorial
              </Link>
              <Link href="/history" className="hover:text-amber-600 transition">
                Game History
              </Link>
              {/*
              <Link
                href="/leaderboard"
                className="hover:text-amber-600 transition"
              >
                Leaderboard
              </Link>
              <Link href="#" className="hover:text-amber-600 transition">
                Settings
              </Link> */}
            </div>

            <div className="relative">
              {/* Trigger Element - Click this to show/hide dropdown */}
              <div
                onClick={toggleMenu}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
              >
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    width={10}
                    height={10}
                    // className="w-9 h-9 rounded-full"
                    className="w-8 h-8 rounded-full object-cover border border-[#B15A1A]/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#B15A1A] flex items-center justify-center text-white text-sm font-bold">
                    {username[0] || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="w-screen px-6 pt-6 md:pt-12 pb-20 relative z-10 flex flex-col lg:flex-row items-center">
          <div className="mr-12 order-2 lg:order-1 w-1/2 ml-8 items-center justify-center flex">
            <div className="md:mt-1 mt-12">
              <div className="mb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                  Welcome back{" "}
                  <span className="text-[#B15A1A]">{username}!!!</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium text-[#B15A1A] mt-3">
                  LET’S PLAY A GAME!!!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 md:gap-4 mb-20">
                <Link
                  href="/tutorial"
                  className="px-4 md:px-10 min-w-36 py-2 md:py-3 bg-white/10 border-2 border-amber-600 text-[#B15A1A] font-semibold rounded-xl hover:bg-[#B15A1A]/20 transition text-sm md:text-md"
                >
                  Read Tutorial
                </Link>
                <button
                  onClick={() => setIsOpenDifficulty(true)}
                  className="px-10 py-2 md:py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-[#B15A1A] transition shadow-lg"
                >
                  Play
                </button>
              </div>
            </div>
          </div>

          {/* Game Cards Display */}
          <div className="relative flex justify-center order-1 lg:order-2 ">
            <div className="grid grid-cols-3 gap-[-32px] items-self-center">
              <div className="w-20 h-auto md:w-36 md:h-48 bg-gray-100 px-2 pt-3 rounded-lg rotate-[-18deg] mt-3">
                <p className="text-[7px] md:text-sm text-[#B15A1A] text-center mt-1 mb-2">
                  Nigerian Artefact
                </p>
                <img
                  src="/images/artefact-1.png"
                  alt=""
                  className="w-full min-h-20 h-auto border border-[#B15A1A] rounded-t-full border-dotted pt-3"
                />
              </div>
              <div className="w-20 h-auto md:w-36 md:h-48 bg-gray-100 px-2 pt-3 rounded-lg ">
                <p className="text-[7px] md:text-sm text-[#B15A1A] text-center mt-1 mb-2">
                  Nigerian Artefact
                </p>
                <img
                  src="/images/artefact-2.png"
                  alt=""
                  className="w-full min-h-20 h-auto border border-[#B15A1A] rounded-t-full border-dotted pt-3"
                />
              </div>
              <div className=" w-20 h-auto md:w-36 md:h-48 bg-gray-100 px-2 pt-3 rounded-lg rotate-[18deg] mt-3">
                <p className="text-[7px] md:text-sm text-[#B15A1A] text-center mt-1 mb-2">
                  Nigerian Artefact
                </p>
                <img
                  src="/images/artefact-3.png"
                  alt=""
                  className="w-full min-h-20 h-auto border border-[#B15A1A] rounded-t-full border-dotted pt-3"
                />
              </div>
              <div className="w-20 h-auto md:w-36 md:h-48 bg-gray-100 px-2 pt-3 rounded-lg rotate-[-162deg] mb-3">
                <p className="text-[7px] md:text-sm text-[#B15A1A] text-center mt-1 mb-2">
                  Nigerian Artefact
                </p>
                <img
                  src="/images/artefact-1.png"
                  alt=""
                  className="w-full min-h-20 h-auto border border-[#B15A1A] rounded-t-full border-dotted pt-3"
                />
              </div>
              <div className="w-20 h-auto md:w-36 md:h-48 bg-gray-100 px-2 pt-3 rounded-lg rotate-[-180deg] mb-3">
                <p className="text-[7px] md:text-sm text-[#B15A1A] text-center mt-1 mb-2">
                  Nigerian Artefact
                </p>
                <img
                  src="/images/artefact-2.png"
                  alt=""
                  className="w-full min-h-20 h-auto border border-[#B15A1A] rounded-t-full border-dotted pt-3"
                />
              </div>
              <div className="w-20 h-auto md:w-36 md:h-48 bg-gray-100 px-2 pt-3 rounded-lg rotate-[162deg] mb-3">
                <p className="text-[7px] md:text-sm text-[#B15A1A] text-center mt-1 mb-2">
                  Nigerian Artefact
                </p>
                <img
                  src="/images/artefact-3.png"
                  alt=""
                  className="w-full min-h-20 h-auto border border-[#B15A1A] rounded-t-full border-dotted pt-3"
                />
              </div>
            </div>
          </div>
        </div>

        <DifficultyModal
          isOpen={isOpenDifficulty}
          onClose={() => setIsOpenDifficulty(false)}
          onSelectLevel={play}
        />

        <LogoutModal
          logout={handleLogout}
          isOpen={showLogoutMenu}
          onClose={() => setShowLogoutMenu(!showLogoutMenu)}
        />
      </div>
    </ProtectedRoute>
  );
}
