"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VoterDashboard() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    fetchActiveElections();
  }, []);

  const fetchActiveElections = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/voter/elections", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setElections(data);
    }
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Active Elections
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Choose an election to participate in
        </p>
      </div>

      {elections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {elections.map((election) => (
            <div
              key={election._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
                    {election.title}
                  </h2>
                  <div className="ml-2 flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                  {election.description}
                </p>

                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ends: {new Date(election.endTime).toLocaleDateString()} at{" "}
                  {new Date(election.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <Link
                  href={`/voter/election/${election._id}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Vote Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            No Active Elections
          </h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            There are currently no active elections available for voting. Please
            check back later or contact your administrator.
          </p>
        </div>
      )}
    </div>
  );
}
