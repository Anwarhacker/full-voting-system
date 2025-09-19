"use client";

import { useEffect, useState } from "react";

export default function Voters() {
  const [voters, setVoters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "voter",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin/voters", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setVoters(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/voters/${editingId}`
      : "/api/admin/voters";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchVoters();
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", role: "voter" });
      setEditingId(null);
    }
  };

  const handleEdit = (voter) => {
    setFormData({
      name: voter.name,
      email: voter.email,
      password: "", // Don't prefill password
      role: voter.role,
    });
    setEditingId(voter._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/admin/voters/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchVoters();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-black">
        <h1 className="text-3xl font-bold">Voters</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Voter
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 border rounded text-black"
        >
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required={!editingId}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="voter">Voter</option>
              <option value="admin">Admin</option>
            </select>
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
                  name: "",
                  email: "",
                  password: "",
                  role: "voter",
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
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter) => (
              <tr key={voter._id}>
                <td className="px-4 py-2 border">{voter.name}</td>
                <td className="px-4 py-2 border">{voter.email}</td>
                <td className="px-4 py-2 border">{voter.role}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(voter)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(voter._id)}
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
