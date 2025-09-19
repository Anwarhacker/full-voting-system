"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VotePage() {
  const { id } = useParams();
  const router = useRouter();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectionData();
  }, [id]);

  const fetchElectionData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/voter/election/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setElection(data.election);
      setCandidates(data.candidates);
      setHasVoted(data.hasVoted);
    }
    setLoading(false);
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;

    const token = localStorage.getItem("token");
    const res = await fetch("/api/voter/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ electionId: id, candidateId: selectedCandidate }),
    });

    if (res.ok) {
      alert("Vote submitted successfully!");
      router.push("/voter");
    } else {
      const error = await res.json();
      alert(error.error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!election) return <div>Election not found</div>;

  if (hasVoted) {
    return (
      <div className="text-center text-black">
        <h1 className="text-3xl font-bold mb-4">Thank You for Voting!</h1>
        <p>You have already voted in this election.</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold mb-8">{election.title}</h1>
      <p className="mb-8">{election.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div
            key={candidate._id}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${
              selectedCandidate === candidate._id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedCandidate(candidate._id)}
          >
            <img
              src={candidate.photo}
              alt={candidate.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-center mb-2">
              {candidate.name}
            </h3>
            <p className="text-center text-gray-600">{candidate.party}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleVote}
          disabled={!selectedCandidate}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 disabled:bg-gray-400"
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}
