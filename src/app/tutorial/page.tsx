"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Leaderboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#f8f1e3] font-capriola relative overflow-hidden text-black">
      {/* Very Faint Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />

      {/* Optional subtle overlay to further soften the background */}
      <div className="absolute inset-0 bg-[#f8f1e3]/70 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed w-screen flex items-center justify-between px-6 py-4 pt-5 backdrop-blur-xs z-50 ">
        <div className="flex items-center gap-3">
          <a href="/dashboard" onClick={() => router.back()}>
            <img src="/images/home.png" alt="logo" className="w-6" />
          </a>
          <h1 className="text-2xl font-bold text-[#B15A1A] ml-7">
            Play Instruction
          </h1>
        </div>
      </nav>

      <div className="w-screen mt-16 max-h-full overflow-y-auto px-6 pt-2 pb-6 relative z-10 flex justify-center">
        <ol className="font-capriola space-y-4 max-w-5xl list-decimal">
          <li className="pl-2">
            Choose Difficulty Level: After signing in and landing on the
            homepage, players click on 'Play' and is prompted to select a level
            which the player has to progress through.
          </li>
          <li className="pl-2">
            Start Level 1: Players start at Level 1 and are then directed to the
            game interface.
          </li>
          {/* <li className="pl-2">
            Game Interface: Upon entering the game interface, players briefly
            see all cards facing up for about 5 seconds. Then, the cards
            automatically flip upside down.
          </li> */}
          <li className="pl-2">
            Match Cards: Players are tasked with clicking on two cards to reveal
            their hidden images. The goal is to find matching pairs of cards.
          </li>
          <li className="pl-2">
            Gameplay Continues: Players continue to select pairs of cards until
            all cards are facing up. If two incorrect cards are selected, they
            are turned face down again almost immediately.
          </li>
          <li className="pl-2">
            Level Completion: Once all cards are successfully matched and facing
            up, a congratulations message pops up on the screen along with a fun
            fact about Nigeria.
          </li>
          <li className="pl-2">
            Move to Next Level: After completing the level, players
            automatically progress to the next level within the chosen
            difficulty level.
          </li>
          <li className="pl-2">
            Repeat and Advance: The gameplay cycle repeats as players progress
            through each level, facing increasingly challenging card
            arrangements and discovering new fun facts about Nigeria along the
            way.
          </li>
        </ol>
      </div>
    </div>
  );
}
