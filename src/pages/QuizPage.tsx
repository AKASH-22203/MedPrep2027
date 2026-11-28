
import { useEffect, useState } from "react";
import { BookOpen, Brain, ClipboardCheck, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { subjects } from "../data/subjects";

interface QuizSubject {
  id: string;
  name: string;
  file: string;
}

interface QuizSubjectResponse {
  subjects: QuizSubject[];
}

interface QuestionBank {
  subject_id: string;
  questions: unknown[];
}

export default function QuizPage() {
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await fetch("/data/quiz/subjects.json");

        if (!response.ok) {
          throw new Error("Unable to load quiz subjects.");
        }

        const data: QuizSubjectResponse = await response.json();

        const results = await Promise.all(
          data.subjects.map(async (subject) => {
            try {
              const questionResponse = await fetch(
                `/data/quiz/${subject.file}`
              );

              if (!questionResponse.ok) return null;

              const bank: QuestionBank = await questionResponse.json();

              return bank.questions.length > 0 ? subject.id : null;
            } catch {
              return null;
            }
          })
        );

        setAvailableSubjects(
          results.filter((id): id is string => id !== null)
        );
      } catch {
        setError("Unable to load quiz subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-white to-teal-50 p-7 shadow-sm sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-bold tracking-wide text-teal-800">
              <Brain size={17} />
              INTERACTIVE QUESTION BANK
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Practice. Prepare.
              <span className="block text-teal-700">Perform Better.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Strengthen your medical knowledge with subject-wise MCQs.
              Practice with instant explanations or challenge yourself
              with a timed test.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <BookOpen size={18} className="text-teal-700" />
                Practice Mode
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                <ClipboardCheck size={18} className="text-indigo-600" />
                Test Mode
              </div>
            </div>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Choose Your Subject
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Select a subject to start practicing questions.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
            <Loader2 size={32} className="animate-spin text-teal-700" />
            <p className="text-sm text-slate-500">Loading subjects...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xl font-extrabold text-slate-900">
                  {subjects.length}
                </p>
                <p className="text-xs text-slate-500">Total Subjects</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xl font-extrabold text-teal-700">
                  {availableSubjects.length}
                </p>
                <p className="text-xs text-slate-500">Available Question Banks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject, index) => {
                const isAvailable = availableSubjects.includes(subject.slug);

                return (
                  <div
                    key={subject.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                      isAvailable
                        ? "border-slate-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
                        : "border-slate-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                        <BookOpen size={23} />
                      </div>

                      <span className="text-xs font-bold text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {subject.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {isAvailable
                        ? "Question bank available"
                        : "Questions coming soon"}
                    </p>

                    {isAvailable ? (
                      <Link
                        to={`/quiz/${subject.slug}`}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                      >
                        Start Practice
                        <ArrowRight size={17} />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
