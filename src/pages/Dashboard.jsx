// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [studentHistory, setStudentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowLoadingId, setRowLoadingId] = useState(null);
  const [err, setErr] = useState("");

  const refreshData = async () => {
    setErr("");
    setLoading(true);
    try {
      const b = await api("/api/Books", { method: "GET", token });
      setBooks(Array.isArray(b) ? b : []);

      const active = await api("/api/StudentBooks", { method: "GET", token });
      setActiveBorrows(Array.isArray(active) ? active : []);

      if (user?.id) {
        const hist = await api(`/api/StudentBooks/history/${user.id}`, {
          method: "GET",
          token,
        });
        setStudentHistory(Array.isArray(hist) ? hist : []);
      }
    } catch (e) {
      setErr(e.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.id]);

  const myActiveBorrows = activeBorrows.filter(
    (x) => String(x.studentId) === String(user?.id)
  );

  const resolveTitle = (borrow) => {
    if (borrow?.bookTitle) return borrow.bookTitle;
    const found = books.find((b) => String(b.id) === String(borrow.bookId));
    if (found?.title) return found.title;
    return `Book #${borrow.bookId}`;
  };

  const returnBorrow = async (borrow) => {
    if (!user?.id) return;
    setRowLoadingId(borrow.id);
    setErr("");
    try {
      await api(`/api/StudentBooks/${user.id}/${borrow.bookId}`, {
        method: "DELETE",
        token,
      });
      setActiveBorrows((prev) => prev.filter((x) => x.id !== borrow.id));
      setStudentHistory((prev) => [
        ...prev,
        { ...borrow, returnDate: new Date().toISOString() },
      ]);
    } catch (e) {
      setErr(e.message || "Return failed.");
    } finally {
      setRowLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {err && (
        <p className="text-sm text-red-600 border border-red-100 bg-red-50 rounded-lg p-3">
          {err}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading data…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📚 Library</h2>
            <p className="text-sm text-gray-600 mb-4">Total books in the library.</p>
            <p className="text-2xl font-bold text-blue-600">{books.length}</p>
          </div>

          <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">🔄 Your Active</h2>
            <p className="text-sm text-gray-600 mb-4">
              Books you currently have on loan.
            </p>
            <p className="text-2xl font-bold text-green-600">
              {myActiveBorrows.length}
            </p>
          </div>

          <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">✅ Returned</h2>
            <p className="text-sm text-gray-600 mb-4">
              Books you have returned so far.
            </p>
            <p className="text-2xl font-bold text-purple-600">
              {studentHistory.length}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Borrow & Return */}
        <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📖 Borrow & Return</h2>
          <p className="text-sm text-gray-600 mb-4">Your currently borrowed books:</p>

          {myActiveBorrows.length === 0 ? (
            <p className="text-gray-500 text-sm">No active borrows.</p>
          ) : (
            <ul className="divide-y rounded-xl border">
              {myActiveBorrows.map((borrow) => (
                <li
                  key={borrow.id}
                  className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {resolveTitle(borrow)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Borrowed:{" "}
                      {borrow.borrowDate
                        ? new Date(borrow.borrowDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <button
                    onClick={() => returnBorrow(borrow)}
                    disabled={rowLoadingId === borrow.id}
                    className="shrink-0 bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 text-sm disabled:opacity-60"
                  >
                    {rowLoadingId === borrow.id ? "Returning…" : "Return"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reports */}
        <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📊 Reports</h2>
          <p className="text-sm text-gray-600 mb-4">Overview of your activity.</p>

          {/* Aktif kitaplar */}
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Active Borrows
          </h3>
          {myActiveBorrows.length === 0 ? (
            <p className="text-gray-500 text-sm mb-3">No active borrows.</p>
          ) : (
            <ul className="mb-4 text-sm space-y-1 list-none">
              {myActiveBorrows.map((b) => (
                <li key={b.id} className="text-gray-700">
                  📖 {resolveTitle(b)} (
                  {b.borrowDate
                    ? new Date(b.borrowDate).toLocaleDateString()
                    : "N/A"}
                  )
                </li>
              ))}
            </ul>
          )}

          {/* Returned history */}
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Returned History
          </h3>
          {studentHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No returns yet.</p>
          ) : (
            <ul className="text-sm space-y-1 max-h-32 overflow-y-auto list-none">
              {studentHistory.map((h, i) => (
                <li key={i} className="text-gray-700">
                  ✅ {resolveTitle(h)} (
                  {h.returnDate
                    ? new Date(h.returnDate).toLocaleDateString()
                    : "N/A"}
                  )
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Reading Tips */}
      <div className="border rounded-xl p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">💡 Reading Tips</h2>
        <ul className="list-none space-y-2 text-gray-700 text-sm">
          <li>📖 Read at least 20 minutes a day – small steps lead to big progress.</li>
          <li>✍️ Take notes – writing down key ideas helps you remember better.</li>
          <li>🌍 Explore different genres – discover new worlds and perspectives.</li>
          <li>🎧 Try audiobooks – keep learning while commuting or relaxing.</li>
          <li>🤝 Share with friends – discuss what you read, learn together.</li>
          <li>🎯 Set reading goals – like one book per month.</li>
          <li>🌱 Create a cozy space – a calm spot makes reading more enjoyable.</li>
          <li>🕰️ Build a routine – pair reading with coffee, or before bedtime.</li>
          <li>😊 Read for joy, not just for knowledge – let books inspire and relax you.</li>
          <li>🚀 Challenge yourself – pick a book outside your comfort zone.</li>
        </ul>
      </div>
    </div>
  );
}
