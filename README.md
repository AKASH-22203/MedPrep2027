
# MedPrep 2027

A web-based medical PG preparation platform that provides students with easy access to Previous Year Questions (PYQs), subject-wise questions, and study notes.

## Features

- **Previous Year Questions:** Browse available question papers by year.
- **Subject-wise Questions:** Explore questions across 19 medical subjects.
- **Study Notes:** Browse and search available study materials.
- **PDF Viewer:** View and download study resources.
- **Practice Quiz:** Coming Soon.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS
- Lucide React

### Backend
- Node.js
- Express.js
- Google Drive API
- Google Service Account

### Storage
- Google Drive (private resource storage)

## Project Structure

```text
MedPrep2027/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── config/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
├── package.json
└── README.md
```

## Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd MedPrep2027
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

### 4. Start the backend

Open another terminal:

```bash
cd server
npm install
npm run dev
```

Configure the backend environment variables and Google service account credentials before starting the backend.

## Security

- Google Drive resources remain private.
- Backend accesses files using a Google service account.
- Credentials and environment files must never be committed to GitHub.

## Future Enhancements

- Student registration and login
- Google authentication
- Student dashboard
- Bookmarks and progress tracking
- Admin dashboard and content management
- Practice Quiz module

## Project Status

**Version:** 1.0

**Status:** Initial release preparation

---

Built to make medical PG preparation resources easier to access.
