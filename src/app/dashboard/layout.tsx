"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check"); // Call the API
        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/login"); // Redirect if not authenticated
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login"); // Redirect if error occurs
      }
    }

    checkAuth();
  }, [router]); // Added router to the dependency array

  if (!isAuthenticated) return null; // Prevent flickering

  return <>{children}</>;
}
