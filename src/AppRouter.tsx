
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";

import App from "./App";
import Navbar from "./components/Navbar";
import ScrollToSection from "./components/ScrollToSection";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import PYQPage from "./pages/PYQPage";
import NotesPage from "./pages/NotesPage";
import QuizPage from "./pages/QuizPage";
import QuizSessionPage from "./pages/QuizSessionPage";

function MainLayout() {
  return (
    <>
      <ScrollToSection />
      <Navbar />
      <Outlet />
    </>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 text-center">
      <h1 className="text-5xl font-bold text-teal-700">404</h1>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        Page Not Found
      </h2>

      <p className="mt-2 text-slate-500">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
      >
        Back to Home
      </Link>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:slug" element={<SubjectDetailPage />} />
          <Route path="/pyqs" element={<PYQPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:slug" element={<QuizSessionPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
