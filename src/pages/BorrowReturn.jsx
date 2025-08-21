import React, { useState, useEffect } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";

export default function BorrowReturn() {

  // Get user info and token from auth system
  const { token, user } = useAuth();

  // Save student + book information in state
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [bookId, setBookId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lists of books and student’s borrowed books
  const [books, setBooks] = useState([]);
  const [studentBorrows, setStudentBorrows] = useState([]);



  // When user logs in, set student info automatically
  useEffect(() => {
    setStudentId(user?.id ? String(user.id) : "");
    setStudentName(user?.fullName || "");
  }, [user]);

  // Load ALL books from API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api("/api/Books", { method: "GET", token });
        if (alive) setBooks(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => (alive = false);  // cleanup if component unmounts
  }, [token]);

  // Load this student’s ACTIVE borrowed books
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sb = await api("/api/StudentBooks", { method: "GET", token });

        // Filter only books borrowed by the logged-in student
        const my = (Array.isArray(sb) ? sb : []).filter(
          (x) => String(x.studentId) === String(user?.id)
        );
        if (alive) setStudentBorrows(my);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => (alive = false);
  }, [token, user?.id, loading]); // reload when borrow/return happens

  // orrow a book
  const doBorrow = async () => {
    setLoading(true);
    setError("");
    try {
      await api("/api/StudentBooks", {
        method: "POST",
        body: {
          studentId: Number(studentId),
          bookId: Number(bookId),
        },
        token,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Return a book
  const doReturn = async () => {
    setLoading(true);
    setError("");
    try {

      // First, get all student-book records
      const all = await api("/api/StudentBooks", { method: "GET", token });
      const list = Array.isArray(all) ? all : [];
      const match = list

      // Find the latest matching borrow record
        .filter(
          (x) =>
            String(x.studentId) === String(studentId) &&
            String(x.bookId) === String(bookId)
        )
        .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))[0];

      if (!match) {
        throw new Error("This student has no active borrow for the selected book.");
      }

      // Backend expects DELETE with {studentId}/{bookId}
      await api(`/api/StudentBooks/${studentId}/${bookId}`, {
        method: "DELETE",
        token,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };


  // Render UI
  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Borrow / Return */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Borrow / Return</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student
            </label>
            <input
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700"
              value={studentName || ""}
              placeholder="Student Name"
              readOnly
              title={studentId ? `StudentId: ${studentId}` : undefined}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Book ID</label>
            <input
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="e.g. 42"
              inputMode="numeric"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={doBorrow}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
              disabled={loading || !studentId || !bookId}
            >
              {loading ? "Working…" : "Borrow"}
            </button>
            <button
              onClick={doReturn}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              disabled={loading || !studentId || !bookId}
            >
              {loading ? "Working…" : "Return"}
            </button>
          </div>
        </div>
        {!!error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {/* Active Borrows */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Active Borrows</h2>
        {studentBorrows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left font-semibold">Record #</th>
                  <th className="px-4 py-2 text-left font-semibold">Book ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Borrow Date</th>
                </tr>
              </thead>
              <tbody>
                {studentBorrows.map((x, i) => (
                  <tr
                    key={x.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 border-b">{x.id}</td>
                    <td className="px-4 py-2 border-b">{x.bookId}</td>
                    <td className="px-4 py-2 border-b font-medium text-gray-800">
                      {x.bookTitle || "-"}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-600">
                      {x.borrowDate
                        ? new Date(x.borrowDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No active borrows.</p>
        )}
      </div>

      {/* Books */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Books</h2>
        {books.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left font-semibold">ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Title</th>
                  <th className="px-4 py-2 text-left font-semibold">Author</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, i) => (
                  <tr
                    key={book.id}
                    onClick={() => setBookId(book.id)}
                    className={`cursor-pointer hover:bg-amber-50 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    title="Click to fill Book ID"
                  >
                    <td className="px-4 py-2 border-b">{book.id}</td>
                    <td className="px-4 py-2 border-b font-medium text-gray-800">
                      {book.title}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-600">{book.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No books available.</p>
        )}
      </div>
    </div>
  );
}
