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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading election details...</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Election Not Found
        </h3>
        <p className="text-gray-500">
          The election you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-green-600"
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
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Thank You for Voting!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Your vote has been recorded successfully.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-green-800 text-sm">
            You have already participated in this election. Each voter can only
            vote once per election.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Election Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {election.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {election.description}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Active Election
            </div>
          </div>
        </div>

        <div className="flex items-center text-xs sm:text-sm text-gray-500">
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
          Voting ends: {new Date(election.endTime).toLocaleDateString()} at{" "}
          {new Date(election.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Select Your Candidate ({candidates.length} candidates)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedCandidate === candidate._id
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedCandidate(candidate._id)}
            >
              <div className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="relative mx-auto mb-4">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/96x96?text=No+Photo";
                      }}
                    />
                    {selectedCandidate === candidate._id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                    {candidate.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">
                    {candidate.party}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vote Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="text-center">
          <div className="mb-4">
            {selectedCandidate ? (
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Candidate selected - Ready to vote!
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                Please select a candidate to proceed with your vote
              </p>
            )}
          </div>

          <button
            onClick={handleVote}
            disabled={!selectedCandidate}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Submit Your Vote
          </button>

          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            By voting, you confirm that this is your final choice. You cannot
            change your vote once submitted.
          </p>
        </div>
      </div>
    </div>
  );
}
