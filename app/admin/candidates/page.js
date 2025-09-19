"use client";

import { useEffect, useState } from "react";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    electionId: "",
    name: "",
    photo: "",
    party: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  const fetchCandidates = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/candidates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setCandidates(data);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/candidates/${editingId}`
      : "/api/admin/candidates";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchCandidates();
      setShowForm(false);
      setFormData({ electionId: "", name: "", photo: "", party: "" });
      setEditingId(null);
    }
  };

  const handleEdit = (candidate) => {
    setFormData({
      electionId: candidate.electionId._id,
      name: candidate.name,
      photo: candidate.photo,
      party: candidate.party,
    });
    setEditingId(candidate._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/candidates/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchCandidates();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-black">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Candidate
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 border rounded text-black"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Election
            </label>
            <select
              value={formData.electionId}
              onChange={(e) =>
                setFormData({ ...formData, electionId: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Election</option>
              {elections.map((election) => (
                <option key={election._id} value={election._id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) =>
                setFormData({ ...formData, photo: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Party
            </label>
            <input
              type="text"
              value={formData.party}
              onChange={(e) =>
                setFormData({ ...formData, party: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ electionId: "", name: "", photo: "", party: "" });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto text-black">
        <table className="min-w-full bg-white border ">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Election</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Photo</th>
              <th className="px-4 py-2 border">Party</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate._id}>
                <td className="px-4 py-2 border">
                  {candidate.electionId.title}
                </td>
                <td className="px-4 py-2 border">{candidate.name}</td>
                <td className="px-4 py-2 border">
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="px-4 py-2 border">{candidate.party}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(candidate)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(candidate._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
