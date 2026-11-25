
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  Loader2,
  BookOpen,
  GraduationCap,
  CalendarDays,
  FolderOpen,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getPYQYears,
  getPYQFiles,
  getPDFViewUrl,
  getPDFDownloadUrl,
  type PYQYear,
  type DriveFile,
} from "../services/api";

export default function PYQPage() {
  const [years, setYears] = useState<PYQYear[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedYear, setSelectedYear] = useState<PYQYear | null>(null);

  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadYears() {
      try {
        setLoading(true);
        const data = await getPYQYears();
        setYears(data);
        setError("");
      } catch {
        setError("Unable to load PYQ years. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadYears();
  }, []);

  async function handleYearClick(year: PYQYear) {
    try {
      setSelectedYear(year);
      setFiles([]);
      setFilesLoading(true);
      setError("");

      const data = await getPYQFiles(year.id);
      setFiles(data);
    } catch {
      setError("Unable to load PDFs for this year.");
    } finally {
      setFilesLoading(false);
    }
  }

  function handleBack() {
    setSelectedYear(null);
    setFiles([]);
    setError("");
  }

  function formatFileSize(size?: string) {
    if (!size || !Number.isFinite(Number(size))) return "";

    const sizeInMB = Number(size) / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  }

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
                PREVIOUS YEAR PRACTICE
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Previous Year
                <span className="block text-teal-700">Questions</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Prepare smarter by practicing medical entrance examination
                question papers organized by year. Strengthen your preparation
                with previous examination papers.
              </p>
            </div>

            <div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-teal-100 bg-white text-teal-700 shadow-sm sm:flex lg:h-36 lg:w-36">
              <CalendarDays size={64} strokeWidth={1.4} />
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
                    {years.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Available Years
                  </p>
                </div>
              </div>

              <div className="flex min-w-44 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                  <FolderOpen size={23} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {years.length > 0 ? "PDFs" : "—"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Question Paper Library
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Selected Year View */}
        {selectedYear ? (
          <section>
            <button
              onClick={handleBack}
              className="mb-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              <ArrowLeft size={17} />
              Back to Years
            </button>

            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-teal-700">
                  <CalendarDays size={15} />
                  SELECTED YEAR
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {selectedYear.name} Question Papers
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  View or download available question papers.
                </p>
              </div>

              {!filesLoading && !error && (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
                  <FileText size={16} />
                  {files.length} Documents
                </span>
              )}
            </div>

            {filesLoading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white">
                <Loader2 size={34} className="animate-spin text-teal-700" />
                <p className="text-sm font-medium text-slate-500">
                  Loading question papers...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center">
                <p className="font-medium text-red-700">{error}</p>
                <button
                  onClick={() => handleYearClick(selectedYear)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            ) : files.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileText size={32} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  No PDFs available
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  No question papers have been uploaded for this year yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="group flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-teal-200 hover:shadow-md sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-100">
                        <FileText size={25} />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Document {String(index + 1).padStart(2, "0")}
                        </div>

                        <h3 className="break-words font-semibold leading-6 text-slate-800 transition group-hover:text-teal-700">
                          {file.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          PDF Document
                          {formatFileSize(file.size)
                            ? ` • ${formatFileSize(file.size)}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <a
                        href={getPDFViewUrl(file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                      >
                        <BookOpen size={16} />
                        View PDF
                      </a>

                      <a
                        href={getPDFDownloadUrl(file.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white">
            <Loader2 size={34} className="animate-spin text-teal-700" />
            <p className="text-sm font-medium text-slate-500">
              Loading available years...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : years.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <FileText size={34} className="mx-auto text-slate-300" />
            <h3 className="mt-4 font-bold text-slate-800">
              No PYQ years found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              No previous year question folders were found in Google Drive.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-teal-700">
                <CalendarDays size={15} />
                QUESTION PAPER ARCHIVE
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                Explore by Year
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Select an examination year to view its question papers.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {years.map((year, index) => (
                <button
                  key={year.id}
                  onClick={() => handleYearClick(year)}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-teal-50 p-3 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                      <BookOpen size={24} />
                    </div>

                    <span className="text-xs font-bold tracking-wider text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 text-3xl font-extrabold text-slate-900 transition group-hover:text-teal-700">
                    {year.name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-slate-500 transition group-hover:text-teal-700">
                      View Question Papers
                    </span>

                    <ArrowRight
                      size={18}
                      className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700"
                    />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
