"use client";

import { useEffect, useState } from "react";

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/elections/${editingId}`
      : "/api/admin/elections";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchElections();
      setShowForm(false);
      setFormData({ title: "", description: "", startTime: "", endTime: "" });
      setEditingId(null);
    }
  };

  const handleEdit = (election) => {
    setFormData({
      title: election.title,
      description: election.description,
      startTime: new Date(election.startTime).toISOString().slice(0, 16),
      endTime: new Date(election.endTime).toISOString().slice(0, 16),
    });
    setEditingId(election._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/elections/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchElections();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-black">
        <h1 className="text-3xl font-bold">Elections</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Election
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 border rounded text-black"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
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
                setFormData({
                  title: "",
                  description: "",
                  startTime: "",
                  endTime: "",
                });
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
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((election) => (
              <tr key={election._id}>
                <td className="px-4 py-2 border">{election.title}</td>
                <td className="px-4 py-2 border">{election.description}</td>
                <td className="px-4 py-2 border">
                  {new Date(election.startTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(election.endTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(election)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(election._id)}
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
