// src/pages/DonateBook.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function DonateBook() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [libraryId, setLibraryId] = useState("");
  const [libraries, setLibraries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");

  // Kütüphaneleri yükle
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const libs = await api("/api/Libraries", { method: "GET", token });
        if (alive) setLibraries(Array.isArray(libs) ? libs : []);
      } catch (e) {
        if (alive) setErr(e.message);
      }
    })();
    return () => (alive = false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setResult("");
    try {
      const res = await api("/api/Books", {
        method: "POST",
        token,
        body: {
          title,
          author,
          year: year ? Number(year) : null,
          isbn: isbn || null,
          libraryId: libraryId ? Number(libraryId) : null,
        },
      });
      setResult(`🎉 Book donated successfully! ID: ${res.id}`);
      setTitle("");
      setAuthor("");
      setYear("");
      setIsbn("");
      setLibraryId("");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📚 Donate a Book</h1>
      <p className="text-gray-600 text-sm">
        Hello {user?.fullName || user?.username}, thank you for contributing to our library!
      </p>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {result && <p className="text-sm text-green-600">{result}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. The Great Gatsby"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder="e.g. F. Scott Fitzgerald"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required 
              placeholder="e.g. 1925"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required 
              placeholder="e.g. 978-3-16-148410-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Library</label>
          <select
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={libraryId}
            onChange={(e) => setLibraryId(e.target.value)}
            required
          >
            <option value="">Select a library</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Donating…" : "Donate Book"}
        </button>
      </form>
    </div>
  );
}
