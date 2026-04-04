// src/components/ProtectedRoute.tsx
"use client";

import { useGameStore } from "@/stores/useGameStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useGameStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true); // ← Important

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/");
      }

      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-capriola">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
