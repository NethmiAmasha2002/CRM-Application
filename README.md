# SalesFlow CRM

A modern full-stack CRM Lead Management System built with React + Firebase.

## Demo Credentials
- Email: `admin@example.com`
- Password: `password123`

## Tech Stack
- **Frontend**: React 18, React Router v6, Recharts, Lucide React
- **Backend/DB**: Firebase (Firestore, Authentication, Hosting)
- **Build**: Vite
- **Styling**: Pure CSS with CSS custom properties

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/salesflow-crm.git
cd CRM Application
npm install
```

### 2. Firebase setup
1. Create a project at https://console.firebase.google.com
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database** (production mode)
4. Copy config from Project Settings → Your apps

### 3. Environment variables
```bash
cp .env.example .env.local
# Fill in your Firebase config values
```

### 4. Firestore security rules
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{leadId} { allow read, write: if request.auth != null; }
    match /notes/{noteId} { allow read, write: if request.auth != null; }
  }
}
```

### 5. Seed the database
```bash
# Download service account key from Firebase Console → Project Settings → Service Accounts
# Save as scripts/serviceAccount.json
npm install firebase-admin
node scripts/seed.js
```

### 6. Run locally
```bash
npm run dev
# Opens at http://localhost:5174
```

## Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting
```

## Features
- Login / logout with Firebase Auth
- Dashboard with live stats + charts (Recharts)
- Full lead CRUD (create, read, update, delete)
- Lead detail page with notes
- Real-time updates via Firestore onSnapshot
- Filter by status, source, salesperson
- Search by name, company, email
- Status pipeline with quick-change sidebar

## Database Collections
- `leads` — all lead records with full fields
- `notes` — notes linked to leads via leadId

## Known Limitations
- Single user role (no RBAC)
- No CSV export
- Salespeople list is hardcoded
- Notes cannot be deleted

## Reflection
Firebase eliminated backend boilerplate and let me ship fast. The hardest part was managing Firestore real-time listeners across route changes without memory leaks — solved by returning the unsubscribe function from useEffect. Given more time I'd add Kanban view, email reminders, and CSV export.
