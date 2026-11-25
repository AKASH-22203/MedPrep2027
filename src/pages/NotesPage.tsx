
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Search,
  BookOpen,
  RefreshCw,
  X,
} from "lucide-react";

import {
  getNotesFiles,
  getPDFViewUrl,
  getPDFDownloadUrl,
  type DriveFile,
} from "../services/api";

export default function NotesPage() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      setLoading(true);
      setError("");
      const data = await getNotesFiles();
      setFiles(data);
    } catch {
      setError("Unable to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return files.filter((file) =>
      file.name.toLowerCase().includes(query)
    );
  }, [files, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition hover:gap-3 hover:text-teal-900"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-2xl bg-teal-100 p-3 text-teal-700">
            <BookOpen size={28} />
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
                Study Resources
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Study Notes
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Access your medical study materials in one place.
                Search, read, and download notes whenever you need them.
              </p>
            </div>

            {!loading && !error && (
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <p className="text-2xl font-bold text-teal-700">
                  {files.length}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Available PDFs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="notes-search"
              className="text-sm font-semibold text-slate-800"
            >
              Find your notes
            </label>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900"
              >
                <X size={14} />
                Clear search
              </button>
            )}
          </div>

          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="notes-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes by filename..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </div>

          {!loading && !error && (
            <p className="mt-3 text-xs text-slate-500">
              Showing {filteredFiles.length} of {files.length} documents
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
            <Loader2 size={34} className="animate-spin text-teal-700" />
            <p className="mt-4 font-medium text-slate-700">
              Loading study notes...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we fetch your documents.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <FileText size={36} className="mx-auto text-red-500" />

            <h3 className="mt-3 font-semibold text-red-800">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              onClick={loadNotes}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredFiles.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileText size={32} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {search ? "No matching notes found" : "No notes available"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try another search term or clear your search."
                : "Study notes will appear here once they are uploaded."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 text-sm font-semibold text-teal-700 hover:text-teal-900"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Notes List */}
        {!loading && !error && filteredFiles.length > 0 && (
          <section>
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Available Notes
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Open a document to read or download it for offline study.
                </p>
              </div>

              <span className="text-sm font-medium text-slate-500">
                {filteredFiles.length} document
                {filteredFiles.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4">
              {filteredFiles.map((file) => (
                <article
                  key={file.id}
                  className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-100">
                      <FileText size={25} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words font-semibold leading-6 text-slate-800">
                        {file.name}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-md bg-red-50 px-2 py-1 font-semibold text-red-600">
                          PDF
                        </span>

                        <span>Study Material</span>

                        {file.size && (
                          <>
                            <span>•</span>
                            <span>{file.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 min-[420px]:flex-row">
                    <a
                      href={getPDFViewUrl(file.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      <BookOpen size={16} />
                      View PDF
                    </a>

                    <a
                      href={getPDFDownloadUrl(file.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
