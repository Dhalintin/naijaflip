"use client";

import Image from "next/image";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import { useGameStore } from "@/stores/useGameStore";
import { createOrUpdateUser } from "@/lib/firestore";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setUser, syncLocalProgressToServer } = useGameStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const updatedUser = await createOrUpdateUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      // Set user first
      setUser({ ...updatedUser, uid: user.uid });

      await syncLocalProgressToServer();

      router.push("/dashboard");
    } catch (err: any) {
      let errorMessage = "Something went wrong. Please try again.";

      // Handle common Firebase Google login errors
      if (err.code) {
        switch (err.code) {
          case "auth/popup-closed-by-user":
            errorMessage = "Login was cancelled. Please try again.";
            break;
          case "auth/popup-blocked":
            errorMessage =
              "Popup was blocked by your browser. Please allow popups and try again.";
            break;
          case "auth/cancelled-popup-request":
            errorMessage =
              "Another popup is already open. Please close it and try again.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage =
              "An account already exists with the same email but different sign-in method.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage = err.message.includes("Firebase")
              ? "Login failed. Please try again."
              : "Unable to sign in with Google. Please try again.";
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const updatedUser = await createOrUpdateUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      setUser({ ...updatedUser, uid: user.uid });

      await syncLocalProgressToServer();

      router.push("/dashboard");
    } catch (err: any) {
      let errorMessage = "Something went wrong. Please try again.";

      // Handle common Firebase Google login errors
      if (err.code) {
        switch (err.code) {
          case "auth/popup-closed-by-user":
            errorMessage = "Login was cancelled. Please try again.";
            break;
          case "auth/popup-blocked":
            errorMessage =
              "Popup was blocked by your browser. Please allow popups and try again.";
            break;
          case "auth/cancelled-popup-request":
            errorMessage =
              "Another popup is already open. Please close it and try again.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage =
              "An account already exists with the same email but different sign-in method.";
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage = err.message.includes("Firebase")
              ? "Login failed. Please try again."
              : "Unable to sign in with Google. Please try again.";
        }
      }

      setError(errorMessage);
    } finally {
      setFacebookLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="w-screen text-black text-black font-capriola">
      {/* Hero Section */}
      <div className="min-h-screen bg-zinc-50 bg-[url('/images/background.png')] bg-cover bg-center flex items-center">
        <div className="w-full h-screen inset-0 mx-auto px-4 sm:px-6 py-6 lg:py-12 bg-gray-200/70">
          <nav className="flex items-center justify-between mb-12 lg:mb-16">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={180}
              height={50}
              className="w-40 sm:w-48"
            />
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Text */}
            <div className="space-y-2 md:space-y-6 text-center lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-black">
                NaijaFlip: Your{" "}
                <span className="text-[#B15A1A]">Fun escape</span> to Nigerian
                Culture!
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 max-w-md mx-auto lg:mx-0">
                Match cards, boost your brain, and discover the beauty of
                Nigeria — all in one game.
              </p>

              <div className="flex gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => router.push("/tutorial")}
                  className="border-2 border-[#B15A1A] text-[#B15A1A] hover:bg-[#B15A1A]/10 px-8 py-3.5 rounded-2xl font-semibold text-sm md:text-md transition"
                >
                  Read Tutorial
                </button>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="max-w-lg mx-auto w-full py-5 bg-white/70 backdrop-blur-md px-6 sm:px-8 rounded-3xl border border-[#B15A1A]/20 shadow-xl">
              <p className="text-[#B15A1A] font-bold text-center text-xl md:text-3xl mb-6 mt-2">
                Log In
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-2 md:mb-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading || facebookLoading}
                  className="flex-1 border border-gray-400 hover:border-gray-600 shadow-sm hover:shadow-md py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition disabled:opacity-70"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <img
                        src="/images/google.png"
                        alt="Google"
                        className="h-5"
                      />
                      Gmail
                    </>
                  )}
                </button>

                <button
                  onClick={handleFacebookLogin}
                  disabled={loading || facebookLoading}
                  className="flex-1 border border-gray-400 hover:border-gray-600 shadow-sm hover:shadow-md py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition"
                >
                  {facebookLoading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <img
                        src="/images/facebook.png"
                        alt="Facebook"
                        className="h-5"
                      />
                      Facebook
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="text-red-600 text-center py-1 tex-xs md:text-sm  rounded-lg mb-1">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className=" bg-[#f8f9fa] relative overflow-hidden bg-[url('/images/about-us.png')] bg-cover">
        <div className="py-20 relative inset-0 bg-white/95 min-h-screen w-screen">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section Title */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-4 bg-white px-10 py-3 rounded-full border border-gray-200 shadow-sm">
                <div className="w-6 h-[2px] bg-amber-600"></div>
                <h2 className="text-2xl font-bold tracking-widest text-gray-800">
                  ABOUT US
                </h2>
                <div className="w-6 h-[2px] bg-amber-600"></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 hidden md:block">
                <div className="flex gap-28">
                  <div className="bg-white rounded-md px-2 pt-8 border border-gray-100 shadow-sm">
                    <p className="text-center text-sm font-medium text-[#B15A1A]">
                      Nigerian Artefact
                    </p>
                    <div className="h-52 border border-dotted rounded-t-full flex items-end justify-center w-36">
                      <img
                        src="/images/artefact-1.png"
                        alt="Nigerian Artefact"
                        className="h-40 object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-md px-2 pt-8 border border-gray-100 shadow-sm">
                    <p className="text-center text-sm font-medium text-[#B15A1A]">
                      Nigerian Artefact
                    </p>
                    <div className="h-52 border border-dotted rounded-t-full flex items-end justify-center w-36">
                      <img
                        src="/images/artefact-2.png"
                        alt="Nigerian Artefact"
                        className="h-40 object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/5">
                  <div className="bg-white rounded-md px-2 pt-8 border border-gray-100 shadow-sm">
                    <p className="text-center text-sm font-medium text-[#B15A1A]">
                      Nigerian Artefact
                    </p>
                    <div className="h-52 border border-dotted rounded-t-full flex items-end justify-center w-36">
                      <img
                        src="/images/artefact-3.png"
                        alt="Nigerian Artefact"
                        className="h-40 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="space-y-6 font-capriola">
                <h3 className="text-2xl font-bold leading-tight text-[#B15A1A]">
                  Ready to Boost Your Brainpower and Take a Trip to Nigeria...
                  All at Once?
                </h3>

                <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                  NaijaFlip isn’t your average memory game. It’s a thrilling mix
                  of brain-teasing challenges and immersive cultural discovery.
                  Match colorful cards featuring Nigerian artefacts, cultures
                  and prominent figures, rack up points, and unlock intriguing
                  facts along the way. Get ready for an unforgettable journey
                  that keeps your mind sharp while expanding your knowledge of
                  Nigeria!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#2C1810] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold tracking-wider mb-2 font-capriola">
            NaijaFlip
          </div>

          <p className="text-amber-200/80 text-xs text-sm mb-4">
            Discover Nigeria • Train Your Mind • Have Fun
          </p>

          <div className="text-xs text-amber-200/60">
            © 2026{" "}
            <a href="" className="underline">
              Vicdab
            </a>
            . All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
