# MedPrep 2027

**A centralized medical PG preparation platform for Previous Year Questions, subject-wise practice, and study resources.**

MedPrep 2027 helps medical PG aspirants access previous year question papers, practise subject-wise questions, and study from organized notes and PDF resources in one place.

## Live Website

🌐 **[MedPrep 2027](https://med-prep2027.vercel.app/)**

💻 **[GitHub Repository](https://github.com/AKASH-22203/MedPrep2027)**

## Features

- **Previous Year Questions (PYQs):** Browse available question papers organized by year.
- **Subject-wise Questions:** Access question collections across 19 medical subjects.
- **Practice Quiz:** Practise questions through the subject-wise quiz interface.
- **Study Notes:** Browse and search available study materials.
- **PDF Viewer:** View and download study resources.
- **Secure Resource Access:** Access privately stored Google Drive resources through the backend.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- Google Drive API
- Google Service Account

### Storage

- Google Drive (private resource storage)

### Deployment

- Vercel – Frontend
- Render – Backend

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

### Prerequisites

- Node.js
- npm
- Google Cloud service account credentials for backend resource access

### 1. Clone the repository

```bash
git clone https://github.com/AKASH-22203/MedPrep2027.git
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

The frontend will run at:

```text
http://localhost:5173
```

### 4. Configure and start the backend

Open another terminal:

```bash
cd server
npm install
npm run dev
```

Configure the required backend environment variables and Google service account credentials before starting the backend.

## Security

- Study resources are stored privately in Google Drive.
- The backend uses a Google service account to access protected resources.
- Sensitive credentials are kept outside the frontend source code.
- Environment files and service account credentials must never be committed to GitHub.

## Future Enhancements

- Student registration and login
- Google authentication
- Personalized student dashboard
- Bookmarks and progress tracking
- Admin dashboard and content management
- Enhanced quiz performance analytics

## Project Status

**Version:** 1.0

**Status:** Live – Actively Developing

---

Built to make medical PG preparation resources easier to access and practise.
