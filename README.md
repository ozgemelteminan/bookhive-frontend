
# Library Frontend (React + Vite + Tailwind)

A clean starter UI for your Library API with:
- Login / Register
- Borrow & Return
- Library & Student Reports

## Setup

1. Create `.env` at project root:

```
VITE_API_BASE_URL=http://localhost:5000
```

2. Install & run:

```bash
npm install
npm run dev
```

## Adjusting Endpoints

Update the paths inside:
- `src/pages/Login.jsx` (`/api/auth/login`)
- `src/pages/Register.jsx` (`/api/auth/register`)
- `src/pages/BorrowReturn.jsx` (`/api/library/borrow`, `/api/library/return`)
- `src/pages/Reports.jsx` (`/api/reports/library`, `/api/reports/student/:id`)

## Notes

- Auth token is stored in `localStorage`, update as needed.
- If your API uses cookies/session, remove the `Authorization` header in `src/api.js` and ensure CORS is configured.
