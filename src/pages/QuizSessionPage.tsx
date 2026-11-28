
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Flag,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { subjects } from "../data/subjects";

type QuizMode = "practice" | "test";
type UserAnswer = string[];

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  topic_id: string;
  question_text: string;
  question_type: string;
  options: QuizOption[];
  correct_option_id?: string;
  correct_option_ids?: string[];
  explanation: string;
  references?: string[];
  difficulty?: string;
  exam_appearances?: (string | { year?: string; exam?: string })[];
}

interface QuestionBank {
  subject_id?: string;
  questions: QuizQuestion[];
}

interface SavedQuizProgress {
  answers: Record<string, UserAnswer>;
  reviewed: string[];
  practiceChecked: string[];
  currentIndex: number;
  selectedTopic: string;
  selectedExam: string;
  submitted: boolean;
  practiceFinished: boolean;
  savedAt: string;
}

function getExamLabels(question: QuizQuestion): string[] {
  return (question.exam_appearances ?? [])
    .map((item) =>
      typeof item === "string"
        ? item
        : [item.exam, item.year].filter(Boolean).join(" ")
    )
    .filter(Boolean);
}

function getCorrectOptionIds(question: QuizQuestion): string[] {
  if (
    Array.isArray(question.correct_option_ids) &&
    question.correct_option_ids.length > 0
  ) {
    return question.correct_option_ids;
  }

  return question.correct_option_id
    ? [question.correct_option_id]
    : [];
}

function isMultipleSelect(question: QuizQuestion): boolean {
  return (
    question.question_type?.toLowerCase().includes("multiple") === true ||
    (question.correct_option_ids?.length ?? 0) > 0
  );
}

function answersAreCorrect(
  selected: string[] | undefined,
  question: QuizQuestion
): boolean {
  if (!selected || selected.length === 0) return false;

  const correct = getCorrectOptionIds(question);

  if (selected.length !== correct.length) return false;

  return (
    [...selected].sort().join("|") === [...correct].sort().join("|")
  );
}

function getOptionTexts(
  question: QuizQuestion,
  optionIds: string[] | undefined
): string {
  if (!optionIds || optionIds.length === 0) return "Not answered";

  return optionIds
    .map(
      (id) =>
        question.options.find((option) => option.id === id)?.text ?? id
    )
    .join(", ");
}

// Each subject, mode and test batch gets its own saved-progress record.
function getProgressKey(
  subjectSlug: string,
  mode: QuizMode,
  batch: number | null
): string {
  const batchPart = mode === "test" ? `batch-${batch}` : "all";
  return `medprep:quiz-progress:v1:${subjectSlug}:${mode}:${batchPart}`;
}

function readSavedProgress(key: string): SavedQuizProgress | null {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;

    const parsed = JSON.parse(saved) as SavedQuizProgress;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.answers !== "object"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default function QuizSessionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  const subject = subjects.find((item) => item.slug === slug);

  const requestedMode = searchParams.get("mode");
  const initialMode: QuizMode | null =
    requestedMode === "practice" || requestedMode === "test"
      ? requestedMode
      : null;

  const [mode, setMode] = useState<QuizMode | null>(initialMode);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [practiceChecked, setPracticeChecked] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [practiceFinished, setPracticeFinished] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  // Tracks which progress record has been restored.
  // This prevents old state from overwriting a newly selected batch.
  const [loadedProgressKey, setLoadedProgressKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadQuestions() {
      if (!subject) {
        setError("Subject not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/data/quiz/questions/${subject.slug}.json`
        );

        if (!response.ok) {
          throw new Error(
            "No question bank is available for this subject yet."
          );
        }

        const bank: QuestionBank = await response.json();

        if (!Array.isArray(bank.questions) || bank.questions.length === 0) {
          throw new Error(
            "No questions are available for this subject yet."
          );
        }

        setQuestions(bank.questions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load questions."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [subject]);

  // Unique storage key for the current subject, mode and batch.
  const progressKey =
    subject && mode && (mode === "practice" || selectedBatch !== null)
      ? getProgressKey(subject.slug, mode, selectedBatch)
      : null;

  // Restore saved progress whenever the student opens a mode or batch.
  useEffect(() => {
    setLoadedProgressKey(null);

    if (!progressKey) return;

    // Start with clean defaults before restoring this particular session.
    setAnswers({});
    setReviewed([]);
    setPracticeChecked([]);
    setCurrentIndex(0);
    setSelectedTopic("all");
    setSelectedExam("all");
    setSubmitted(false);
    setPracticeFinished(false);

    const saved = readSavedProgress(progressKey);

    if (saved) {
      setAnswers(saved.answers ?? {});
      setReviewed(saved.reviewed ?? []);
      setPracticeChecked(saved.practiceChecked ?? []);
      setCurrentIndex(
        Number.isInteger(saved.currentIndex) && saved.currentIndex >= 0
          ? saved.currentIndex
          : 0
      );
      setSelectedTopic(saved.selectedTopic ?? "all");
      setSelectedExam(saved.selectedExam ?? "all");
      setSubmitted(saved.submitted === true);
      setPracticeFinished(saved.practiceFinished === true);
    }

    setLoadedProgressKey(progressKey);
  }, [progressKey]);

  // Automatically save every change after the correct record is restored.
  useEffect(() => {
    if (!progressKey || loadedProgressKey !== progressKey) return;

    const progress: SavedQuizProgress = {
      answers,
      reviewed,
      practiceChecked,
      currentIndex,
      selectedTopic,
      selectedExam,
      submitted,
      practiceFinished,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch (err) {
      console.error("Unable to save quiz progress:", err);
    }
  }, [
    progressKey,
    loadedProgressKey,
    answers,
    reviewed,
    practiceChecked,
    currentIndex,
    selectedTopic,
    selectedExam,
    submitted,
    practiceFinished,
  ]);

  // Divide the question bank into batches of 50 for Test Mode.
  const batchCount = Math.ceil(questions.length / 50);

  const batchQuestions = useMemo(() => {
    if (mode !== "test" || selectedBatch === null) {
      return questions;
    }

    const startIndex = (selectedBatch - 1) * 50;
    return questions.slice(startIndex, startIndex + 50);
  }, [questions, mode, selectedBatch]);

  const topics = useMemo(
    () => [
      ...new Set(
        batchQuestions
          .map((question) => question.topic_id)
          .filter(Boolean)
      ),
    ],
    [batchQuestions]
  );

  const exams = useMemo(
    () => [
      ...new Set(
        batchQuestions.flatMap((question) => getExamLabels(question))
      ),
    ],
    [batchQuestions]
  );

  const filteredQuestions = useMemo(
    () =>
      batchQuestions.filter((question) => {
        const topicMatches =
          selectedTopic === "all" || question.topic_id === selectedTopic;

        const examMatches =
          selectedExam === "all" ||
          getExamLabels(question).includes(selectedExam);

        return topicMatches && examMatches;
      }),
    [batchQuestions, selectedTopic, selectedExam]
  );

  const currentQuestion = filteredQuestions[currentIndex];

  const selectedAnswer = currentQuestion
    ? answers[currentQuestion.id] ?? []
    : [];

  const isPractice = mode === "practice";

  const currentIsMultiple = currentQuestion
    ? isMultipleSelect(currentQuestion)
    : false;

  const currentPracticeChecked = currentQuestion
    ? practiceChecked.includes(currentQuestion.id)
    : false;

  const correctCount = filteredQuestions.filter((question) =>
    answersAreCorrect(answers[question.id], question)
  ).length;

  const answeredCount = filteredQuestions.filter(
    (question) => (answers[question.id]?.length ?? 0) > 0
  ).length;

  const scorePercentage =
    filteredQuestions.length > 0
      ? Math.round((correctCount / filteredQuestions.length) * 100)
      : 0;

  function chooseAnswer(optionId: string) {
    if (!currentQuestion || submitted) return;

    const questionId = currentQuestion.id;
    const multiple = isMultipleSelect(currentQuestion);

    if (isPractice && practiceChecked.includes(questionId)) return;

    if (!multiple) {
      setAnswers((previous) => ({
        ...previous,
        [questionId]: [optionId],
      }));

      if (isPractice) {
        setPracticeChecked((previous) =>
          previous.includes(questionId)
            ? previous
            : [...previous, questionId]
        );
      }

      return;
    }

    setAnswers((previous) => {
      const existing = previous[questionId] ?? [];

      const updated = existing.includes(optionId)
        ? existing.filter((id) => id !== optionId)
        : [...existing, optionId];

      return {
        ...previous,
        [questionId]: updated,
      };
    });
  }

  function checkPracticeAnswer() {
    if (!currentQuestion || !isPractice || submitted) return;
    if (selectedAnswer.length === 0) return;

    setPracticeChecked((previous) =>
      previous.includes(currentQuestion.id)
        ? previous
        : [...previous, currentQuestion.id]
    );
  }

  function toggleReview() {
    if (!currentQuestion) return;

    setReviewed((previous) =>
      previous.includes(currentQuestion.id)
        ? previous.filter((id) => id !== currentQuestion.id)
        : [...previous, currentQuestion.id]
    );
  }

  function changeFilter(type: "topic" | "exam", value: string) {
    if (type === "topic") setSelectedTopic(value);
    else setSelectedExam(value);

    setCurrentIndex(0);
  }

  // Clear the current attempt and return to the mode selection screen.
  function restartQuiz() {
    if (progressKey) {
      localStorage.removeItem(progressKey);
    }

    setAnswers({});
    setReviewed([]);
    setPracticeChecked([]);
    setCurrentIndex(0);
    setSubmitted(false);
    setPracticeFinished(false);
    setMode(null);
    setSelectedTopic("all");
    setSelectedExam("all");
    setSelectedBatch(null);
    setLoadedProgressKey(null);
  }

  // Restart the current practice session or test batch from the beginning.
  function restartCurrentSession() {
    if (
      !window.confirm(
        "Restart this attempt? Your saved answers and progress for this attempt will be cleared."
      )
    ) {
      return;
    }

    if (progressKey) {
      localStorage.removeItem(progressKey);
    }

    setAnswers({});
    setReviewed([]);
    setPracticeChecked([]);
    setCurrentIndex(0);
    setSubmitted(false);
    setPracticeFinished(false);
    setSelectedTopic("all");
    setSelectedExam("all");
  }

  function backToTestBatches() {
    setAnswers({});
    setReviewed([]);
    setPracticeChecked([]);
    setCurrentIndex(0);
    setSubmitted(false);
    setPracticeFinished(false);
    setSelectedTopic("all");
    setSelectedExam("all");
    setSelectedBatch(null);
  }

  function submitTest() {
    if (window.confirm("Are you sure you want to submit this test?")) {
      setSubmitted(true);
      setCurrentIndex(0);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 size={34} className="animate-spin text-teal-700" />
        <p className="text-sm text-slate-500">Loading questions...</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Question Bank Unavailable
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {error || "The requested subject could not be found."}
          </p>
          <Link
            to="/quiz"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          >
            <ArrowLeft size={16} />
            Back to Quiz Subjects
          </Link>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-700"
          >
            <ArrowLeft size={16} />
            Back to Subjects
          </Link>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wider text-teal-700">
              {subject.name}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Choose Your Quiz Mode
            </h1>

            <p className="mt-3 text-slate-500">
              Select how you want to attempt this question bank.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <button
                onClick={() => setMode("practice")}
                className="rounded-2xl border-2 border-teal-100 p-6 text-left transition hover:border-teal-500 hover:bg-teal-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <BookOpenIcon />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Practice Mode
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Get instant feedback after selecting an answer.
                  Read explanations and references while learning.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">
                  Start / Resume Practice <ArrowRight size={16} />
                </span>
              </button>

              <button
                onClick={() => setMode("test")}
                className="rounded-2xl border-2 border-indigo-100 p-6 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <ClipboardIcon />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Test Mode
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Attempt questions without seeing answers. Submit your
                  test to view your score and detailed explanations.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-700">
                  Continue to Test Batches <ArrowRight size={16} />
                </span>
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              {questions.length} questions available in this question bank.
              Your progress is saved automatically in this browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show batch selection before starting a Test Mode session.
  if (mode === "test" && selectedBatch === null) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => setMode(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to Quiz Modes
          </button>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-700">
              {subject.name} · Test Mode
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Choose Your Test Batch
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your question bank is divided into batches of 50 questions.
              Complete each batch independently. Your progress is saved
              automatically.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: batchCount }, (_, index) => {
                const batchNumber = index + 1;
                const start = index * 50 + 1;
                const end = Math.min(batchNumber * 50, questions.length);
                const count = end - start + 1;

                const batchKey = getProgressKey(
                  subject.slug,
                  "test",
                  batchNumber
                );

                const savedBatch = readSavedProgress(batchKey);

                const batchStatus = savedBatch?.submitted
                  ? "Completed · View Results"
                  : savedBatch
                    ? "Progress saved · Resume Test"
                    : "Not started";

                return (
                  <button
                    key={batchNumber}
                    onClick={() => {
                      setSelectedBatch(batchNumber);
                      setAnswers({});
                      setReviewed([]);
                      setPracticeChecked([]);
                      setCurrentIndex(0);
                      setSubmitted(false);
                      setPracticeFinished(false);
                      setSelectedTopic("all");
                      setSelectedExam("all");
                    }}
                    className="rounded-2xl border-2 border-indigo-100 p-6 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-indigo-100 p-3 text-indigo-700">
                        <ClipboardIcon />
                      </span>

                      <span className="text-xs font-bold text-indigo-600">
                        BATCH {batchNumber}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                      Questions {start}–{end}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {count} questions
                    </p>

                    <p
                      className={`mt-3 text-xs font-semibold ${
                        savedBatch?.submitted
                          ? "text-green-700"
                          : savedBatch
                            ? "text-indigo-700"
                            : "text-slate-400"
                      }`}
                    >
                      {batchStatus}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-700">
                      {savedBatch ? "Open Batch" : "Start Test"}{" "}
                      <ArrowRight size={16} />
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Total: {questions.length} questions · {batchCount} batches
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Do not render the quiz until the correct saved session is restored.
  if (progressKey && loadedProgressKey !== progressKey) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 size={34} className="animate-spin text-teal-700" />
        <p className="text-sm text-slate-500">Restoring your progress...</p>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            No matching questions
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No questions match the selected filters.
          </p>

          <button
            onClick={() => {
              setSelectedTopic("all");
              setSelectedExam("all");
              setCurrentIndex(0);
            }}
            className="mt-5 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (submitted || practiceFinished) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              <CheckCircle2 size={34} />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-wider text-teal-700">
              {submitted ? "Test Submitted" : "Practice Completed"}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              {submitted ? "Your Test Results" : "Your Practice Results"}
            </h1>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <ResultCard
                label="Score"
                value={`${correctCount}/${filteredQuestions.length}`}
              />
              <ResultCard label="Accuracy" value={`${scorePercentage}%`} />
              <ResultCard label="Correct" value={String(correctCount)} />
              <ResultCard
                label="Wrong"
                value={String(answeredCount - correctCount)}
              />
              <ResultCard
                label="Unanswered"
                value={String(filteredQuestions.length - answeredCount)}
              />
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {filteredQuestions.length - answeredCount} unanswered questions
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {submitted && mode === "test" && (
                <button
                  onClick={backToTestBatches}
                  className="rounded-lg border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Back to Test Batches
                </button>
              )}

              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
              >
                <RotateCcw size={16} />
                Try Again
              </button>

              <Link
                to="/quiz"
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Choose Another Subject
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Answer Review
            </h2>

            <div className="space-y-4">
              {filteredQuestions.map((question, index) => {
                const userAnswer = answers[question.id] ?? [];
                const correctIds = getCorrectOptionIds(question);
                const isCorrect = answersAreCorrect(userAnswer, question);

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2
                          className="mt-1 shrink-0 text-green-600"
                          size={20}
                        />
                      ) : (
                        <XCircle
                          className="mt-1 shrink-0 text-red-600"
                          size={20}
                        />
                      )}

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-400">
                          QUESTION {index + 1}
                        </p>

                        <h3 className="mt-1 font-semibold text-slate-900">
                          {question.question_text}
                        </h3>

                        <p className="mt-3 text-sm text-slate-600">
                          Your answer:{" "}
                          <strong>
                            {getOptionTexts(question, userAnswer)}
                          </strong>
                        </p>

                        <p className="mt-1 text-sm text-green-700">
                          Correct answer:{" "}
                          <strong>
                            {getOptionTexts(question, correctIds)}
                          </strong>
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {question.explanation}
                        </p>

                        {question.references &&
                          question.references.length > 0 && (
                            <p className="mt-3 text-xs text-slate-500">
                              References: {question.references.join(" • ")}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const revealFeedback =
    submitted ||
    (isPractice &&
      (!currentIsMultiple ||
        currentPracticeChecked));

  const hasSelectedAnswer = selectedAnswer.length > 0;

  const currentAnswerIsCorrect =
    currentQuestion &&
    answersAreCorrect(selectedAnswer, currentQuestion);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-teal-700"
            >
              <ArrowLeft size={16} />
              All Subjects
            </Link>

            <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
              {subject.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isPractice ? "Practice Mode" : "Test Mode"} ·{" "}
              {filteredQuestions.length} questions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                isPractice
                  ? "bg-teal-50 text-teal-700"
                  : "bg-indigo-50 text-indigo-700"
              }`}
            >
              {isPractice ? "Practice Mode" : "Test Mode"}
            </span>

            <button
              onClick={restartCurrentSession}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              Restart
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Topic
            <select
              value={selectedTopic}
              onChange={(event) =>
                changeFilter("topic", event.target.value)
              }
              className="min-w-48 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
            >
              <option value="all">All Topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic.replaceAll("-", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
            Exam / Year
            <select
              value={selectedExam}
              onChange={(event) =>
                changeFilter("exam", event.target.value)
              }
              className="min-w-48 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
            >
              <option value="all">All Exams / Years</option>
              {exams.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <main className="min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-teal-700">
                  QUESTION {currentIndex + 1} OF {filteredQuestions.length}
                </p>

                <button
                  onClick={toggleReview}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                    reviewed.includes(currentQuestion.id)
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Flag size={15} />
                  {reviewed.includes(currentQuestion.id)
                    ? "Marked for Review"
                    : "Mark for Review"}
                </button>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all"
                  style={{
                    width: `${
                      ((currentIndex + 1) / filteredQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>

              <h2 className="mt-7 text-lg font-bold leading-8 text-slate-900 sm:text-xl">
                {currentQuestion.question_text}
              </h2>

              {currentIsMultiple && (
                <p className="mt-3 text-sm font-semibold text-indigo-700">
                  Select all that apply. More than one option may be correct.
                </p>
              )}

              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer.includes(option.id);
                  const isCorrect = getCorrectOptionIds(
                    currentQuestion
                  ).includes(option.id);

                  const reveal = revealFeedback && hasSelectedAnswer;

                  let optionStyle =
                    "border-slate-200 hover:border-teal-300 hover:bg-teal-50";

                  if (isSelected) {
                    optionStyle = "border-teal-500 bg-teal-50";
                  }

                  if (reveal && isCorrect) {
                    optionStyle = "border-green-400 bg-green-50";
                  }

                  if (reveal && isSelected && !isCorrect) {
                    optionStyle = "border-red-400 bg-red-50";
                  }

                  const optionDisabled =
                    submitted ||
                    (isPractice && currentPracticeChecked) ||
                    (isPractice && !currentIsMultiple && hasSelectedAnswer);

                  return (
                    <button
                      key={option.id}
                      onClick={() => chooseAnswer(option.id)}
                      disabled={optionDisabled}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${optionStyle}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold text-slate-500">
                        {option.id}
                      </span>

                      <span className="flex-1 pt-1 text-sm leading-6 text-slate-700">
                        {option.text}
                      </span>

                      {reveal && isCorrect && (
                        <CheckCircle2
                          size={19}
                          className="shrink-0 text-green-600"
                        />
                      )}

                      {reveal && isSelected && !isCorrect && (
                        <XCircle
                          size={19}
                          className="shrink-0 text-red-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Practice Mode: multiple-select answer submission */}
              {isPractice &&
                currentIsMultiple &&
                !currentPracticeChecked && (
                  <button
                    onClick={checkPracticeAnswer}
                    disabled={!hasSelectedAnswer}
                    className="mt-5 w-full rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  >
                    Check Answer
                  </button>
                )}

              {/* Answer feedback */}
              {revealFeedback &&
                hasSelectedAnswer &&
                (isPractice || submitted) && (
                  <div
                    className={`mt-6 rounded-xl border p-5 ${
                      currentAnswerIsCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p
                      className={`font-bold ${
                        currentAnswerIsCorrect
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {currentAnswerIsCorrect
                        ? "Correct Answer!"
                        : "Incorrect Answer"}
                    </p>

                    {currentIsMultiple && (
                      <p className="mt-2 text-sm text-slate-700">
                        <strong>Your selection:</strong>{" "}
                        {getOptionTexts(currentQuestion, selectedAnswer)}
                      </p>
                    )}

                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {currentQuestion.explanation}
                    </p>

                    {currentQuestion.references &&
                      currentQuestion.references.length > 0 && (
                        <p className="mt-3 text-xs leading-5 text-slate-600">
                          <strong>References:</strong>{" "}
                          {currentQuestion.references.join(" • ")}
                        </p>
                      )}
                  </div>
                )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <button
                  onClick={() =>
                    setCurrentIndex((index) => Math.max(0, index - 1))
                  }
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                {currentIndex < filteredQuestions.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentIndex((index) =>
                        Math.min(filteredQuestions.length - 1, index + 1)
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Next Question
                    <ArrowRight size={16} />
                  </button>
                ) : isPractice ? (
                  <button
                    onClick={() => setPracticeFinished(true)}
                    className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Finish Practice
                  </button>
                ) : (
                  <button
                    onClick={submitTest}
                    className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </main>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-900">Question Palette</h2>

            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-teal-600" />
                Answered
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
                Review
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm border border-slate-300" />
                Unanswered
              </span>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {filteredQuestions.map((question, index) => {
                const isAnswered =
                  (answers[question.id]?.length ?? 0) > 0;

                const isReviewed = reviewed.includes(question.id);

                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to question ${index + 1}`}
                    className={`relative flex h-10 items-center justify-center rounded-lg border text-sm font-bold ${
                      currentIndex === index
                        ? "border-teal-700 bg-teal-700 text-white"
                        : isReviewed
                          ? "border-amber-300 bg-amber-100 text-amber-800"
                          : isAnswered
                            ? "border-teal-200 bg-teal-50 text-teal-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Answered</span>
                <strong>{answeredCount}</strong>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Unanswered</span>
                <strong>{filteredQuestions.length - answeredCount}</strong>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Marked for review</span>
                <strong>
                  {
                    reviewed.filter((id) =>
                      filteredQuestions.some(
                        (question) => question.id === id
                      )
                    ).length
                  }
                </strong>
              </div>
            </div>

            {!isPractice && (
              <button
                onClick={submitTest}
                className="mt-6 w-full rounded-lg bg-indigo-700 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-800"
              >
                Submit Test
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function BookOpenIcon() {
  return <Circle size={24} />;
}

function ClipboardIcon() {
  return <Flag size={24} />;
}
