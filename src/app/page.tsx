import Link from "next/link";
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  Code2,
  Eye,
  MousePointerClick,
  PlayCircle,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Custom Tracker SDK",
    desc: "Embed one script tag and capture clicks, routes, console errors, failed APIs, and input changes.",
    icon: Code2,
  },
  {
    title: "Ghost Replay",
    desc: "Scrub through the exact user journey with synced event timeline and error markers.",
    icon: Eye,
  },
  {
    title: "AI Bug Reports",
    desc: "Convert raw browser events into title, severity, steps, actual result, expected result, and fix suggestion.",
    icon: Sparkles,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Install SDK",
    desc: "Paste one script tag into your existing website or app.",
  },
  {
    step: "02",
    title: "Capture user events",
    desc: "Rewind.dev records clicks, route changes, console errors, and failed API calls.",
  },
  {
    step: "03",
    title: "Replay and report",
    desc: "Use Ghost Replay and AI Bug Reports to understand exactly what broke.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050807] text-[#F3FFF8]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(57,255,136,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,77,77,0.14),transparent_30%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(57,255,136,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <nav className="sticky top-0 z-50 border-b border-[#1F3A2E]/70 bg-[#050807]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F3A2E] bg-[#0E1512] font-black text-[#39FF88] shadow-[0_0_24px_rgba(57,255,136,0.18)]">
              R
            </div>

            <span className="font-display text-xl font-bold">Rewind.dev</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#7F9B8B] md:flex">
            <a className="transition hover:text-[#39FF88]" href="#features">
              Features
            </a>

            <a className="transition hover:text-[#39FF88]" href="#how-it-works">
              How it works
            </a>

            <Link
              className="transition hover:text-[#39FF88]"
              href="/ghost-replay-demo"
            >
              Ghost Replay Demo
            </Link>

            <a className="transition hover:text-[#39FF88]" href="#free-plan">
              Free Plan
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-[#1F3A2E] bg-[#0E1512] px-4 py-2 text-sm font-bold text-[#F3FFF8] transition hover:border-[#39FF88] sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-[#39FF88] px-4 py-2 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-105"
            >
              Try for Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1F3A2E] bg-[#0E1512]/80 px-4 py-2 text-sm font-bold text-[#39FF88]">
            <Zap size={15} />
            AI-powered bug reproduction platform
          </div>

          <h1 className="font-display text-5xl font-black tracking-tight md:text-7xl">
            Go back to the exact moment it{" "}
            <span className="text-[#FF4D4D]">broke.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#7F9B8B]">
            Rewind.dev captures user clicks, route changes, console errors, and
            failed API calls — then turns them into AI-generated bug reports
            with replayable timelines.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#39FF88] px-6 py-3 font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-105"
            >
              Try Rewind.dev for Free
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/ghost-replay-demo"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1F3A2E] bg-[#0E1512] px-6 py-3 font-bold text-[#F3FFF8] transition hover:border-[#39FF88] hover:text-[#39FF88]"
            >
              <PlayCircle size={18} />
              View Ghost Replay Demo
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[
              ["Free", "demo access"],
              ["AI", "bug reports"],
              ["1 tag", "install SDK"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512]/70 p-4"
              >
                <p className="font-display text-2xl font-bold text-[#39FF88]">
                  {value}
                </p>

                <p className="mt-1 text-xs text-[#7F9B8B]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/90 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF4D4D]" />
            <span className="h-3 w-3 rounded-full bg-[#FFB84D]" />
            <span className="h-3 w-3 rounded-full bg-[#39FF88]" />
            <span className="ml-3 text-sm text-[#7F9B8B]">
              rewind-tracker.js
            </span>
          </div>

          <div className="rounded-2xl bg-[#020403] p-5 font-code text-sm leading-7 text-[#39FF88]">
            <p>{">"} Session started...</p>
            <p>{">"} Click captured: #checkout-button</p>
            <p>{">"} Route changed: /cart → /checkout</p>

            <p className="text-[#FFB84D]">
              {">"} API warning: POST /payment took 4.8s
            </p>

            <p className="text-[#FF4D4D]">
              {">"} Console error: PaymentIntent undefined
            </p>

            <p>{">"} Generating AI bug report...</p>

            <div className="mt-5 rounded-xl border border-[#1F3A2E] bg-[#0E1512] p-4 text-[#F3FFF8]">
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="font-bold">AI Bug Report</p>

                <span className="rounded-full bg-[#FF4D4D]/15 px-3 py-1 text-xs font-bold text-[#FF4D4D]">
                  CRITICAL
                </span>
              </div>

              <p className="text-sm text-[#7F9B8B]">
                Payment fails after checkout click because PaymentIntent is
                undefined during API response handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold text-[#39FF88]">WHY IT WINS</p>

          <h2 className="font-display mt-3 text-4xl font-bold">
            Built like a real developer tool.
          </h2>

          <p className="mt-3 max-w-2xl text-[#7F9B8B]">
            Rewind.dev is not just a UI project. It combines full-stack product
            engineering, tracking SDK logic, session replay, and AI-style report
            generation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/80 p-6 transition hover:-translate-y-1 hover:border-[#39FF88]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88] shadow-[0_0_28px_rgba(57,255,136,0.12)]">
                  <Icon size={24} />
                </div>

                <h3 className="font-display text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-[#7F9B8B]">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold text-[#39FF88]">HOW IT WORKS</p>

          <h2 className="font-display mt-3 text-4xl font-bold">
            From user complaint to reproducible bug.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/80 p-6"
            >
              <p className="font-display text-4xl font-black text-[#39FF88]">
                {item.step}
              </p>

              <h3 className="mt-5 font-display text-xl font-bold">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-[#7F9B8B]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="free-plan" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] border border-[#39FF88]/30 bg-[#0E1512]/90 p-8 shadow-[0_20px_80px_rgba(57,255,136,0.08)] md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-sm font-bold text-[#39FF88]">
                FREE PUBLIC DEMO
              </p>

              <h2 className="font-display mt-3 text-4xl font-bold">
                Try Ghost Replay before signing in.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-[#7F9B8B]">
                The Ghost Replay demo is free and public for now. Visitors can
                understand the product value instantly without creating an
                account.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "No login needed for demo",
                  "Replay timeline preview",
                  "AI bug summary preview",
                  "Free developer-friendly onboarding",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#39FF88]" />
                    <span className="text-sm text-[#CFFFE1]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#1F3A2E] bg-[#020403] p-6">
              <p className="text-sm font-bold text-[#7F9B8B]">Plan</p>

              <h3 className="mt-2 font-display text-3xl font-black text-[#39FF88]">
                Free
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#7F9B8B]">
                Best for students, demos, minor/major project evaluation, and
                hackathon presentations.
              </p>

              <Link
                href="/ghost-replay-demo"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#39FF88] font-bold text-[#031008] transition hover:scale-[1.02]"
              >
                View free demo
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] border border-[#1F3A2E] bg-[#0E1512]/90 p-8 text-center md:p-12">
          <Bug className="mx-auto text-[#39FF88]" size={40} />

          <h2 className="font-display mt-5 text-4xl font-bold">
            Stop guessing what went wrong.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#7F9B8B]">
            Capture the user journey, replay the issue, and generate a clean bug
            report your team can actually use.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#39FF88] px-6 py-3 font-bold text-[#031008] transition hover:scale-105"
            >
              Try for Free
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/ghost-replay-demo"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1F3A2E] px-6 py-3 font-bold text-[#F3FFF8] transition hover:border-[#39FF88] hover:text-[#39FF88]"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1F3A2E] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-[#7F9B8B]">
          <p>© 2026 Rewind.dev</p>

          <p>Built for debugging, replay, and AI bug reports.</p>
        </div>
      </footer>
    </main>
  );
}