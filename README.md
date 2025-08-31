# HD Notes (Email OTP + Google OAuth)

## Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Express (TypeScript), Mongoose, JWT, Passport (Google OAuth)
- **Database**: MongoDB

## Features
- Email + OTP signup/signin (validated inputs)
- Google OAuth signup/login
- JWT-based auth for creating/deleting notes
- Responsive UI matching provided assets

## Monorepo Layout
```
server/   # Express TS API
client/   # React TS app (Vite)
```

## Prerequisites
- Node 18+
- MongoDB running locally or a cloud URI

## Setup
1. Clone repo and create env file:
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` with your values.

2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Run backend:
   ```bash
   cd server
   npm run dev
   ```

4. Run frontend:
   ```bash
   cd client
   npm run dev
   ```

5. Open the app at http://localhost:5173

## Build
- Server: `cd server && npm run build`
- Client: `cd client && npm run build`

## Deployment
- Backend: Render (Node + Docker or Build Command `npm run build`, Start `node dist/server.js`).
- Frontend: Render Static Site or Vercel. Set `VITE_API_URL` env to your backend URL.

## API Summary
- `POST /api/auth/send-otp` { email, name?, dob? }
- `POST /api/auth/verify-otp` { email, otp } -> { token }
- `GET /api/notes` (Bearer token)
- `POST /api/notes` { title } (Bearer token)
- `DELETE /api/notes/:id` (Bearer token)
- `GET /api/auth/google` -> redirect flow
- `GET /api/auth/google/callback` -> redirects to client with token

## Git Workflow
- Commit after each feature (auth, notes, UI, deploy). Include clear messages.

## Env Notes
- Gmail requires an app password (2FA). Set EMAIL_USER and EMAIL_PASS.
- Configure OAuth consent screen and authorized redirect URI: `http://localhost:4000/api/auth/google/callback` and your production URL.