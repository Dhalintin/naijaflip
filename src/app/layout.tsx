import type { Metadata } from "next";
import { Geist, Geist_Mono, Capriola } from "next/font/google";
import { enableIndexedDbPersistence } from "firebase/firestore";
import "./globals.css";
import { db } from "@/lib/firebase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NaijaFlip",
  description: "Created by Dhalintin",
};

const capriola = Capriola({
  weight: ["400"], // Capriola is mostly regular weight
  subsets: ["latin"],
  variable: "--font-capriola", // This makes it easy to use in Tailwind
  display: "swap", // Prevents layout shift
});

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn(
      "Multiple tabs open – persistence can only be enabled in one tab."
    );
  } else if (err.code === "unimplemented") {
    console.warn("Browser does not support persistence.");
  }
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${capriola.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
