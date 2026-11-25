
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  GraduationCap,
  Layers,
  RefreshCw,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getSubjects,
  type DriveSubject,
} from "../services/api";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<DriveSubject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSubjects() {
    try {
      setLoading(true);
      setError("");
      const data = await getSubjects();
      setSubjects(data);
    } catch {
      setError("Unable to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Page Header */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-white to-teal-50 p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-bold tracking-wide text-teal-800">
                <GraduationCap size={17} />
                MEDICAL STUDY MATERIAL
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Subject-wise
                <span className="block text-teal-700">Questions</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Strengthen your medical knowledge with organized practice
                questions across all major medical subjects. Choose a subject
                and start practicing.
              </p>
            </div>

            <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-teal-100 bg-white text-teal-700 shadow-sm sm:flex lg:h-36 lg:w-36">
              <BookOpen size={64} strokeWidth={1.4} />
            </div>
          </div>

          {!loading && !error && (
            <div className="relative mt-8 flex flex-wrap gap-3 border-t border-teal-100 pt-6">
              <div className="flex min-w-44 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                  <BookOpen size={23} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {subjects.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Available Subjects
                  </p>
                </div>
              </div>

              <div className="flex min-w-44 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                  <Layers size={23} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {filteredSubjects.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Matching Subjects
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Search and Section Heading */}
        <section>
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-teal-700">
                <Layers size={15} />
                SUBJECT LIBRARY
              </div>

              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                Explore Subjects
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Select a subject to view its available questions.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
                aria-label="Search subjects"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-11 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>

          {!loading && !error && search.trim() !== "" && (
            <p className="mb-5 text-sm text-slate-500">
              Found{" "}
              <span className="font-bold text-teal-700">
                {filteredSubjects.length}
              </span>{" "}
              matching subject(s)
            </p>
          )}
        </section>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white">
            <Loader2 size={34} className="animate-spin text-teal-700" />
            <p className="text-sm font-medium text-slate-500">
              Loading subjects...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center">
            <p className="font-medium text-red-700">{error}</p>

            <button
              onClick={loadSubjects}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              {search.trim() ? "No subjects found" : "No subjects available"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search.trim()
                ? "Try searching with a different subject name."
                : "No subject folders were found in Google Drive."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                <X size={16} />
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSubjects.map((subject, index) => (
              <Link
                key={subject.id}
                to={`/subjects/${subject.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-teal-50 p-3 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                    <BookOpen size={24} />
                  </div>

                  <span className="text-xs font-bold tracking-wider text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 min-h-12 break-words text-lg font-bold leading-snug text-slate-900 transition group-hover:text-teal-700">
                  {subject.name}
                </h3>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-slate-500 transition group-hover:text-teal-700">
                    View Questions
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
