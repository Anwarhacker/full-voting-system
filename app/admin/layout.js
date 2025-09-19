"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/elections"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Elections
          </Link>
          <Link
            href="/admin/candidates"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Candidates
          </Link>
          <Link
            href="/admin/voters"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Voters
          </Link>
          <Link
            href="/admin/reports"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Reports
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            Logout
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
