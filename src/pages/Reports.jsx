// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function Reports() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [studentBorrows, setStudentBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const b = await api("/api/Books", { method: "GET", token });
        if (alive) setBooks(Array.isArray(b) ? b : []);
        const sb = await api("/api/StudentBooks", { method: "GET", token });
        const my = (Array.isArray(sb) ? sb : []).filter(
          (x) => String(x.studentId) === String(user?.id)
        );
        if (alive) setStudentBorrows(my);
      } catch (e) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [token, user?.id]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 Reports</h1>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Library Report</h2>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-2">
                Total books: <b>{books.length}</b>
              </p>
              <div className="max-h-56 overflow-auto bg-gray-50 rounded-xl p-3">
                <ul className="list-disc pl-5 text-sm">
                  {books.map((b) => (
                    <li key={b.id}>
                      #{b.id} — {b.title} <span className="text-gray-500">({b.author})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="border rounded-xl p-6 bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Student Report</h2>
          {loading ? (
            <p>Loading…</p>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-2">
                Student: <b>{user?.fullName || user?.username}</b> — Active borrows:{" "}
                <b>{studentBorrows.length}</b>
              </p>
              <div className="max-h-56 overflow-auto bg-gray-50 rounded-xl p-3">
                <ul className="list-disc pl-5 text-sm">
                  {studentBorrows.map((x) => (
                    <li key={x.id}>
                      Record #{x.id} — Book #{x.bookId} {x.bookTitle ? `— ${x.bookTitle}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
