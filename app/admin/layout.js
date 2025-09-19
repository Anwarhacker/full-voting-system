"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-4">
          <Link
            href="/admin"
            className="block px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/elections"
            className="block px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Elections
          </Link>
          <Link
            href="/admin/candidates"
            className="block px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Candidates
          </Link>
          <Link
            href="/admin/voters"
            className="block px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Voters
          </Link>
          <Link
            href="/admin/reports"
            className="block px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            Reports
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
