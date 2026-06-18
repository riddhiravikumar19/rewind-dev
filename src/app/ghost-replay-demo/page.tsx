import Link from "next/link";
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  Code2,
  MousePointerClick,
  PlayCircle,
  Radio,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    title: "Connect your website",
    desc: "Create a website inside Rewind.dev and copy the generated tracker key.",
    icon: Radio,
  },
  {
    title: "Install the SDK",
    desc: "Paste the Rewind.dev script tag into your website layout.",
    icon: Code2,
  },
  {
    title: "Capture real user actions",
    desc: "Clicks, page visits, console errors, API failures, and form actions are captured from the browser.",
    icon: MousePointerClick,
  },
  {
    title: "Replay the session",
    desc: "Open the captured session inside Ghost Replay and inspect the real event timeline.",
    icon: PlayCircle,
  },
];

export default function GhostReplayDemoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050807] text-[#F3FFF8]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(57,255,136,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,77,77,0.14),transparent_30%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(57,255,136,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#39FF88] transition hover:underline"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <Link
          href="/signup"
          className="rounded-xl bg-[#39FF88] px-5 py-2 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-105"
        >
          Try Rewind.dev for Free
        </Link>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-[#1F3A2E] bg-[#0E1512]/80 px-4 py-2 text-sm font-bold text-[#39FF88]">
            Ghost Replay
          </div>

          <h1 className="font-display text-5xl font-black tracking-tight md:text-7xl">
            Replay real sessions, not guesses.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#7F9B8B]">
            Ghost Replay shows the exact user journey captured from your real
            connected website. It helps developers inspect clicks, routes,
            browser events, console errors, and failed API calls from actual
            sessions.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-[#39FF88] px-6 py-3 font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-105"
            >
              Connect a website
            </Link>

            <Link
              href="/dashboard/replay"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1F3A2E] bg-[#0E1512] px-6 py-3 font-bold text-[#F3FFF8] transition hover:border-[#39FF88] hover:text-[#39FF88]"
            >
              Open Ghost Replay
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <Icon size={24} />
                </div>

                <h2 className="font-display mt-5 text-xl font-bold">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#7F9B8B]">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        <section className="mt-16 rounded-[2rem] border border-[#1F3A2E] bg-[#0E1512]/90 p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="text-sm font-bold text-[#39FF88]">
                REAL DATA FLOW
              </p>

              <h2 className="font-display mt-3 text-4xl font-bold">
                How a real replay is created
              </h2>

              <p className="mt-4 leading-7 text-[#7F9B8B]">
                A real replay is created only after your connected website sends
                browser events to Rewind.dev through the tracker SDK. Once a
                session is captured, it appears inside Sessions and Ghost Replay.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Create website inside Rewind.dev",
                  "Copy tracker script",
                  "Paste script into your website",
                  "Open your website and perform actions",
                  "View real captured session inside dashboard",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#39FF88]" />
                    <span className="text-sm text-[#CFFFE1]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#1F3A2E] bg-[#020403] p-6">
              <Bug className="text-[#39FF88]" size={32} />

              <h3 className="font-display mt-5 text-2xl font-bold">
                No fake bug shown here
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#7F9B8B]">
                This page does not show fake failed messages. To see real
                replay data, we will use a tracker test page and capture actual
                browser events from your app.
              </p>

              <Link
                href="/dashboard/projects"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#39FF88] font-bold text-[#031008] transition hover:scale-[1.02]"
              >
                Set up real tracking
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-[#39FF88]/30 bg-[#39FF88]/10 p-8 text-center">
          <Sparkles className="mx-auto text-[#39FF88]" size={38} />

          <h2 className="font-display mt-5 text-3xl font-bold">
            Next: generate a real captured session
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#7F9B8B]">
            The next step is to create a real tracker test page where your SDK
            captures actual clicks, inputs, and errors. That will make your
            dashboard numbers change from 0 to real values.
          </p>
        </section>
      </section>
    </main>
  );
}