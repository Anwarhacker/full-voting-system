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
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Active Elections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => (
          <div key={election._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{election.title}</h2>
            <p className="text-gray-600 mb-4">{election.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Ends: {new Date(election.endTime).toLocaleString()}
            </p>
            <Link
              href={`/voter/election/${election._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
            >
              Vote Now
            </Link>
          </div>
        ))}
      </div>
      {elections.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No active elections at the moment.
        </p>
      )}
    </div>
  );
}
