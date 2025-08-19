# 🐝 BookHive-Frontend

A React + Vite frontend application for the **Library Management System**, designed to interact with the backend API (ASP.NET Core + MSSQL).

---

## Features

- **User Authentication**
  - Login and registration with JWT-based authentication.
  - Token stored in `localStorage`, automatically included in API requests.

- **Dashboard**
  - Displays user-specific borrowed and returned books.

- **Borrow & Return Books**
  - Borrow new books from the library.
  - Return previously borrowed books.

- **Donate Books**
  - Users can contribute by adding new books to the library.

- **Reports**
  - Provides summaries of library statistics (e.g., books borrowed, donations).

---

## Tech Stack

- [React](https://react.dev/) (with Hooks)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- Built-in **fetch API** for HTTP requests

---

## Project Structure

```
library-frontend2/
│── public/              # Static assets
│── src/
│   ├── api.js           # API helper with base URL config
│   ├── auth.jsx         # Auth context (login, logout, register)
│   ├── App.jsx          # Router setup
│   ├── styles.css       # Tailwind + custom styles
│   └── pages/           # App pages
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── Dashboard.jsx
│       ├── BorrowReturn.jsx
│       ├── DonateBook.jsx
│       └── Reports.jsx
│── package.json
│── vite.config.js
│── index.html
```

---

## API Endpoints Used

The frontend expects the backend API to run at `http://localhost:5274` (configurable).

### Authentication
- `POST /api/Students/login` → User login
- `POST /api/Students/register` → User registration

### Books
- `GET /api/Books` → List all books
- `POST /api/Books` → Donate a new book

### Borrow / Return
- `POST /api/StudentBooks/borrow` → Borrow a book
- `POST /api/StudentBooks/return` → Return a borrowed book

### Dashboard
- `GET /api/StudentBooks/mybooks` → List logged-in student’s borrowed books

### Libraries
- `GET /api/Libraries` → List available libraries

---

## Authentication Flow

- On **login** or **register**, backend responds with `{ token, studentId }`.
- Token is stored in `localStorage`.
- API helper (`src/api.js`) attaches `Authorization: Bearer <token>` automatically.
- Logout clears local storage.

---

## Setup & Development

### 1. Clone the repo

```bash
git clone <repo-url>
cd library-frontend2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API URL

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5274
```

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Notes

- Make sure the backend (LibraryApi) is running before starting the frontend.
- Default API base URL is `http://localhost:5274`, changeable via `.env`.

---

## License

This project is for educational/demo purposes.
