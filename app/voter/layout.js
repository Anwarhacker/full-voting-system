"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VoterLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "voter") {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Voter Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 sm:px-4 rounded hover:bg-red-600 text-sm sm:text-base transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
