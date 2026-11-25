
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Download,
  FileText,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getSubjectFiles,
  getPDFViewUrl,
  getPDFDownloadUrl,
  type DriveFile,
} from "../services/api";

export default function SubjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFiles() {
      if (!slug) {
        setError("Invalid subject.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getSubjectFiles(slug);
        setFiles(data);
      } catch {
        setError("Unable to load question papers for this subject.");
      } finally {
        setLoading(false);
      }
    }

    loadFiles();
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:py-14">

        {/* Breadcrumb */}
        <Link
          to="/subjects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Back to Subjects
        </Link>

        {/* Page Header */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                <BookOpen size={17} />
                SUBJECT-WISE PRACTICE
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Subject Questions
              </h1>

              <p className="mt-3 max-w-xl leading-7 text-slate-500">
                Access and practice question papers organized for this medical
                subject. Select any PDF to study or download it for later.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-teal-50 p-5 text-teal-700 sm:block">
              <FolderOpen size={42} />
            </div>
          </div>

          {!loading && !error && (
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
                <FileText size={22} className="text-teal-700" />
                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {files.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Available PDFs
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Question Papers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse available study documents.
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              {files.length} Documents
            </span>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white">
            <Loader2 size={32} className="animate-spin text-teal-700" />
            <p className="text-sm font-medium text-slate-500">
              Loading question papers...
            </p>
          </div>

        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>

        ) : files.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileText size={32} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No question papers available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No PDFs have been uploaded for this subject yet.
            </p>

            <Link
              to="/subjects"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              <ArrowLeft size={16} />
              Explore Other Subjects
            </Link>
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
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Document {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="break-words font-semibold leading-6 text-slate-800 transition group-hover:text-teal-700">
                      {file.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF Document
                      {file.size
                        ? ` • ${(Number(file.size) / (1024 * 1024)).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <a
                    href={getPDFViewUrl(file.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    <BookOpen size={16} />
                    View PDF
                  </a>

                  <a
                    href={getPDFDownloadUrl(file.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
