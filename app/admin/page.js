"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    elections: 0,
    candidates: 0,
    voters: 0,
    votes: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Elections
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.elections}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Candidates
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.candidates}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Voters</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.voters}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Votes</h3>
          <p className="text-3xl font-bold text-red-600">{stats.votes}</p>
        </div>
      </div>
    </div>
  );
}
