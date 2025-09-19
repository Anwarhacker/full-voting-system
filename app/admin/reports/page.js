"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/elections", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setElections(data);
    }
  };

  const fetchResults = async (electionId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/results/${electionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    }
  };

  const handleElectionChange = (e) => {
    const electionId = e.target.value;
    setSelectedElection(electionId);
    if (electionId) {
      fetchResults(electionId);
    } else {
      setResults([]);
    }
  };

  const exportCSV = () => {
    const csv = [
      ["Candidate", "Party", "Votes"],
      ...results.map((r) => [r.name, r.party, r.votes]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "election_results.csv";
    a.click();
  };

  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold mb-8">Election Reports</h1>
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Election
        </label>
        <select
          value={selectedElection}
          onChange={handleElectionChange}
          className="block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Choose an election</option>
          {elections.map((election) => (
            <option key={election._id} value={election._id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      {results.length > 0 && (
        <div>
          <div className="mb-8">
            <button
              onClick={exportCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Export CSV
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Vote Results</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Candidate</th>
                  <th className="px-4 py-2 border">Party</th>
                  <th className="px-4 py-2 border">Votes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{result.name}</td>
                    <td className="px-4 py-2 border">{result.party}</td>
                    <td className="px-4 py-2 border">{result.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
