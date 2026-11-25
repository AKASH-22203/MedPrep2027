
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileText,
  Stethoscope,
  Target,
  Trophy,
  BookMarked,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const subjects = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Pharmacology",
  "Microbiology",
  "Forensic Medicine",
  "Community Medicine",
  "ENT",
  "Ophthalmology",
  "Medicine",
  "Surgery",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "Orthopedics",
  "Dermatology",
  "Psychiatry",
  "Radiology",
  "Anesthesia",
];

const resources = [
  {
    title: "Previous Year Questions",
    description: "Practice previous years' medical PG examination questions.",
    icon: FileText,
    href: "/pyqs",
    number: "01",
    available: true,
  },
  {
    title: "Subject-wise Questions",
    description: "Explore practice questions organized by medical subjects.",
    icon: BookOpen,
    href: "/subjects",
    number: "02",
    available: true,
  },
  {
    title: "Study Notes",
    description: "Access organized study notes and revision materials.",
    icon: BookMarked,
    href: "/notes",
    number: "03",
    available: true,
  },
  {
    title: "Practice Quiz",
    description: "Test your knowledge with MCQs and explanations.",
    icon: ClipboardList,
    href: "#",
    number: "04",
    available: false,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        {/* Hero */}
        <section id="home" className="relative scroll-mt-24 overflow-hidden bg-slate-950">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-medium text-teal-300">
                <Stethoscope size={17} />
                Your Medical PG Learning Companion
              </div>

              <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Prepare smarter.
                <span className="block text-teal-400">Achieve more.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Your preparation, organized in one place. Access previous
                year questions, subject-wise practice, study notes and
                interactive quizzes.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#resources"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-900/30 transition hover:bg-teal-400"
                >
                  Start Preparing
                  <ArrowRight size={18} />
                </a>

                <a
                  href="#subjects"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3.5 font-semibold text-white transition hover:border-teal-400 hover:text-teal-300"
                >
                  Browse Subjects
                </a>
              </div>

              <div className="mt-12 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-bold text-white">19</p>
                  <p className="mt-1 text-sm text-slate-400">Medical Subjects</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="mt-1 text-sm text-slate-400">Learning Sections</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="mt-1 text-sm text-slate-400">Learning Platform</p>
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Your preparation starts here</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      Study Dashboard
                    </h3>
                  </div>
                  <div className="rounded-xl bg-teal-500/15 p-3 text-teal-300">
                    <Target size={28} />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {resources.map((resource) => {
                    const Icon = resource.icon;

                    const content = (
                      <>
                        <div className="rounded-xl bg-teal-500/15 p-3 text-teal-300">
                          <Icon size={22} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{resource.title}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {resource.available
                              ? "Explore learning materials"
                              : "Coming soon"}
                          </p>
                        </div>
                        {resource.available ? (
                          <ChevronRight className="text-slate-400" size={19} />
                        ) : (
                          <Clock className="text-amber-300" size={18} />
                        )}
                      </>
                    );

                    return resource.available ? (
                      <Link
                        key={resource.number}
                        to={resource.href}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-teal-400/50 hover:bg-white/10"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={resource.number}
                        aria-disabled="true"
                        className="flex cursor-not-allowed items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 opacity-60"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-xl bg-teal-500/10 p-4">
                  <Trophy className="text-teal-300" size={23} />
                  <p className="text-sm text-teal-100">
                    Consistent practice builds confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section id="resources" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
              Learning Resources
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to prepare
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Find your learning materials organized into four dedicated sections.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => {
              const Icon = resource.icon;

              const cardContent = (
                <>
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-teal-50 p-3 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                      <Icon size={25} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">
                      {resource.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {resource.title}
                  </h3>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate-500">
                    {resource.description}
                  </p>

                  {resource.available ? (
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                      Explore
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </div>
                  ) : (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      <Clock size={14} />
                      Coming Soon
                    </div>
                  )}
                </>
              );

              return resource.available ? (
                <Link
                  key={resource.number}
                  to={resource.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl"
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={resource.number}
                  aria-disabled="true"
                  className="group cursor-not-allowed rounded-2xl border border-slate-200 bg-white p-6 opacity-75 shadow-sm"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </section>

        {/* Subjects */}
        <section id="subjects" className="scroll-mt-24 border-y border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-teal-700">
                  Subject Library
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  Explore all 19 subjects
                </h2>
                <p className="mt-3 max-w-xl text-slate-500">
                  Browse medical subjects and find your study materials in one place.
                </p>
              </div>

              <Link
                to="/subjects"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:bg-teal-50"
              >
                View Subject Library
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {subjects.map((subject, index) => (
                <div
                  key={subject}
                  className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-teal-300 hover:bg-teal-50"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-teal-700 shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {subject}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="rounded-3xl bg-teal-800 px-7 py-12 text-center sm:px-12 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-teal-100">
              <Stethoscope size={30} />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white">
              Your preparation. Your pace.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-teal-100">
              MedPrep brings your medical PG preparation resources together
              so you can focus on learning, practicing and improving every day.
            </p>
            <a
              href="#resources"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-teal-800 transition hover:bg-teal-50"
            >
              Explore Resources
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:text-left lg:px-8">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-teal-700" size={22} />
            <span className="font-bold text-slate-800">MedPrep 2027</span>
          </div>
          <p className="text-sm text-slate-500">
            Learn. Practice. Prepare.
          </p>
          <p className="text-xs text-slate-400">
            © 2027 MedPrep. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
