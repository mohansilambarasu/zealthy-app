# Zealthy Mini-EMR & Patient Portal

A full-stack healthcare application with an admin EMR and patient-facing portal.

## Tech Stack

- **Frontend:** React + Vite, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT + bcrypt

## Features

### Admin EMR (`/admin`)

- View all patients in a table
- Create new patients (with settable password)
- Edit patient info
- Full CRUD for appointments (with repeat schedules and end dates)
- Full CRUD for prescriptions (medication + dosage from seeded list)

### Patient Portal (`/`)

- Login with email and password
- Dashboard with 7-day summary of appointments and refills
- Full appointment schedule (3 months out) with past appointments
- Full prescriptions list with refill status indicators

## Sample Credentials

| Name         | Email                        | Password     |
| ------------ | ---------------------------- | ------------ |
| Mark Johnson | mark@some-email-provider.net | Password123! |
| Lisa Smith   | lisa@some-email-provider.net | Password123! |

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally

### Backend

```bash
cd backend
npm install
# Create .env file with:
# PORT=8000
# MONGO_URI=mongodb://localhost:27017/zealthy
# JWT_SECRET=zealthy_super_secret_key_2024
npm run seed   # seed sample data
npm run dev    # runs on port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # runs on port 5173
```

Then open `http://localhost:5173`

## Project Structure

```
zealthy-app/
├── backend/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express API routes
│   ├── middleware/     # JWT auth middleware
│   ├── seed.js         # Database seeder
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── api/        # Axios API calls
        ├── context/    # Auth context
        └── pages/      # React pages
```
