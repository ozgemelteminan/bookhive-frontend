// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Reports() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [studentHistory, setStudentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setErr("");
      setLoading(true);
      try {
        // tüm kitaplar
        const b = await api("/api/Books", { method: "GET", token });
        if (alive) setBooks(Array.isArray(b) ? b : []);

        // öğrenci geçmişi
        if (user?.id) {
          const hist = await api(`/api/StudentBooks/history/${user.id}`, {
            method: "GET",
            token,
          });
          if (alive) setStudentHistory(Array.isArray(hist) ? hist : []);
        }
      } catch (e) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [token, user?.id]);

  // dıştaki bg-gradient kaldırıldı. sadece beyaz kart kaldı.
  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📊 Reports</h1>

      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* Library Report */}
      <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Library Report 📚
        </h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-4">
              Total books: <b>{books.length}</b>
            </p>
            <div className="overflow-auto rounded-xl border">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Author</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{b.id}</td>
                      <td className="px-4 py-2 font-medium">{b.title}</td>
                      <td className="px-4 py-2">{b.author}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Student History Report */}
      <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Student History 🕵️
        </h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-4">
              Student: <b>{user?.fullName || user?.username}</b> — Returned
              books: <b>{studentHistory.length}</b>
            </p>

            <div className="overflow-auto rounded-xl border">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2">Record #</th>
                    <th className="px-4 py-2">Book</th>
                    <th className="px-4 py-2">Borrowed</th>
                    <th className="px-4 py-2">Returned</th>
                  </tr>
                </thead>
                <tbody>
                  {studentHistory.map((x) => (
                    <tr key={x.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{x.id}</td>
                      <td className="px-4 py-2">
                        #{x.bookId} {x.bookTitle || ""}
                      </td>
                      <td className="px-4 py-2">
                        {x.borrowDate
                          ? new Date(x.borrowDate).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {x.returnDate
                          ? new Date(x.returnDate).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
