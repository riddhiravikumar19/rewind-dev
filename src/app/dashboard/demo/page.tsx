import Link from "next/link";
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  Clipboard,
  Code2,
  Download,
  Eye,
  FileText,
  Globe2,
  PlayCircle,
  Radio,
  Sparkles,
} from "lucide-react";

const demoSteps = [
  {
    number: "01",
    title: "Create a Website",
    description:
      "Register the website or app that you want Rewind.dev to monitor.",
    icon: Globe2,
    link: "/dashboard/projects",
    cta: "Open Websites",
  },
  {
    number: "02",
    title: "Copy Tracking Key",
    description:
      "Each website receives a unique tracking key used by the tracker SDK.",
    icon: Clipboard,
    link: "/dashboard/projects",
    cta: "Copy Key",
  },
  {
    number: "03",
    title: "Load Tracker SDK",
    description:
      "Paste the tracking key inside the tracker test page and load the SDK.",
    icon: Code2,
    link: "/tracker-test",
    cta: "Open Tracker Test",
  },
  {
    number: "04",
    title: "Run Bug Scenario",
    description:
      "Trigger real clicks, route changes, failed API calls, and captured errors.",
    icon: PlayCircle,
    link: "/tracker-test",
    cta: "Run Test",
  },
  {
    number: "05",
    title: "View New Session",
    description:
      "Rewind.dev stores the captured session with browser, device, events, and severity.",
    icon: Radio,
    link: "/dashboard/sessions",
    cta: "Open Sessions",
  },
  {
    number: "06",
    title: "Watch Ghost Replay",
    description:
      "Replay the real captured session step by step using the saved event timeline.",
    icon: Eye,
    link: "/dashboard/sessions",
    cta: "Open Replay",
  },
  {
    number: "07",
    title: "Generate Bug Report",
    description:
      "Convert a captured session into a structured developer-ready bug report.",
    icon: Sparkles,
    link: "/dashboard/sessions",
    cta: "Generate Report",
  },
  {
    number: "08",
    title: "Download Report",
    description:
      "Export the generated bug report as a .txt file for developers or reviewers.",
    icon: Download,
    link: "/dashboard/reports",
    cta: "Open Reports",
  },
];

const productHighlights = [
  "Real tracker SDK integration",
  "Fresh session creation",
  "Captured browser timeline",
  "Failed API detection",
  "Console error tracking",
  "Real Ghost Replay",
  "AI-style bug report generation",
  "Downloadable developer report",
];

export default function DemoFlowPage() {
  return (
    <div>
      <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">PROJECT DEMO FLOW</p>

          <h1 className="font-display mt-3 text-4xl font-bold">
            Rewind.dev Live Demo Guide
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-[#7F9B8B]">
            Follow this flow during your project presentation to show how
            Rewind.dev captures a real session, replays it, and generates a
            developer-ready bug report.
          </p>
        </div>

        <Link
          href="/tracker-test"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#39FF88] px-6 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.02]"
        >
          Start Live Demo
          <ArrowRight size={17} />
        </Link>
      </header>

      <section className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
            <Globe2 size={22} />
          </div>
          <p className="text-sm font-bold text-[#7F9B8B]">
            Connected Website
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Tracker-ready
          </h2>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3BA7FF]/10 text-[#3BA7FF]">
            <Radio size={22} />
          </div>
          <p className="text-sm font-bold text-[#7F9B8B]">
            Session Capture
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Real events
          </h2>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFB84D]/10 text-[#FFB84D]">
            <Eye size={22} />
          </div>
          <p className="text-sm font-bold text-[#7F9B8B]">Ghost Replay</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Timeline replay
          </h2>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF4D4D]/10 text-[#FF4D4D]">
            <Bug size={22} />
          </div>
          <p className="text-sm font-bold text-[#7F9B8B]">Bug Report</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Auto-generated
          </h2>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold">
              Live Presentation Steps
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
              Use these steps exactly while presenting the project.
            </p>
          </div>

          <div className="space-y-5">
            {demoSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group rounded-3xl border border-[#1F3A2E] bg-[#050807]/85 p-6 transition hover:border-[#39FF88]/50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                        <Icon size={22} />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#39FF88]">
                          STEP {step.number}
                        </p>

                        <h3 className="font-display mt-2 text-xl font-bold">
                          {step.title}
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7F9B8B]">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={step.link}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] px-4 text-xs font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                    >
                      {step.cta}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-8">
          <div className="rounded-3xl border border-[#39FF88]/30 bg-[#39FF88]/10 p-7">
            <div className="mb-5 flex items-center gap-3 text-[#39FF88]">
              <FileText size={22} />
              <h2 className="font-display text-xl font-bold">
                Judge Explanation
              </h2>
            </div>

            <p className="text-sm leading-7 text-[#CFFFE1]">
              Rewind.dev helps developers debug production issues faster. It
              connects to a website using a tracker SDK, captures real user
              sessions, reconstructs the timeline through Ghost Replay, and
              converts the session into a structured bug report.
            </p>
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <h2 className="font-display text-2xl font-bold">
              What This Proves
            </h2>

            <div className="mt-6 space-y-4">
              {productHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[#1F3A2E] bg-[#050807] px-4 py-3"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-[#39FF88]"
                  />
                  <span className="text-sm font-semibold text-[#CFFFE1]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#FFB84D]/30 bg-[#FFB84D]/10 p-7">
            <h2 className="font-display text-xl font-bold text-[#FFB84D]">
              Demo Tip
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#FFE0A3]">
              Before presenting, open the tracker test page in one tab and the
              dashboard sessions page in another tab. This makes it easy to show
              the session count increasing live.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}