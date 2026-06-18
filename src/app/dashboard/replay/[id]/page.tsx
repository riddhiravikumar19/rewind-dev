"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton";
import {
    AlertTriangle,
    ArrowLeft,
    Bug,
    ExternalLink,
    Pause,
    Play,
    RotateCcw,
  } from "lucide-react";

type Session = {
  _id: string;
  projectName: string;
  sessionToken: string;
  browser: string;
  os: string;
  device: string;
  screenSize: string;
  eventCount: number;
  hasError: boolean;
  autoSeverity: string | null;
  startedAt: string;
  endedAt: string | null;
};

type EventItem = {
  _id: string;
  type: string;
  url: string;
  timestamp: string;
  payload: Record<string, any>;
};

function getEventTitle(event: EventItem) {
  if (event.type === "page_load") return "Page Loaded";
  if (event.type === "click") return "User Click";
  if (event.type === "console_error") return "Console Error";
  if (event.type === "network_fail") return "Network Failure";
  if (event.type === "route_change") return "Route Changed";
  return event.type;
}

function getEventSummary(event: EventItem) {
  const payload = event.payload || {};

  if (event.type === "page_load") {
    return payload.title || "Page loaded";
  }

  if (event.type === "click") {
    return payload.text || payload.selector || payload.tag || "Clicked element";
  }

  if (event.type === "console_error") {
    if (Array.isArray(payload.message)) {
      return payload.message
        .map((item: any) =>
          typeof item === "string" ? item : item?.message || JSON.stringify(item)
        )
        .join(" ");
    }

    return payload.message || "Console error captured";
  }

  if (event.type === "network_fail") {
    return `${payload.url || "Request"} failed with status ${payload.status}`;
  }

  if (event.type === "route_change") {
    return `${payload.from || ""} → ${payload.to || ""}`;
  }

  return "Event captured";
}

function getReplayMessage(event: EventItem) {
  if (event.type === "page_load") {
    return "The user entered the page. Rewind.dev started capturing the session.";
  }

  if (event.type === "click") {
    return "The user clicked an element. This action is highlighted as a replay step.";
  }

  if (event.type === "console_error") {
    return "A console error was captured during this interaction.";
  }

  if (event.type === "network_fail") {
    return "A failed API or network request happened at this point in the session.";
  }

  if (event.type === "route_change") {
    return "The user navigated to another route during the session.";
  }

  return "A tracked browser event occurred.";
}

function getEventTone(type: string) {
  if (type === "console_error") {
    return {
      pill: "bg-[#FF4D4D]/10 text-[#FF4D4D]",
      glow: "bg-[#FF4D4D]",
      border: "border-[#FF4D4D]/40",
    };
  }

  if (type === "network_fail") {
    return {
      pill: "bg-[#FFB84D]/10 text-[#FFB84D]",
      glow: "bg-[#FFB84D]",
      border: "border-[#FFB84D]/40",
    };
  }

  if (type === "click") {
    return {
      pill: "bg-[#39FF88]/10 text-[#39FF88]",
      glow: "bg-[#39FF88]",
      border: "border-[#39FF88]/40",
    };
  }

  if (type === "route_change") {
    return {
      pill: "bg-[#3BA7FF]/10 text-[#3BA7FF]",
      glow: "bg-[#3BA7FF]",
      border: "border-[#3BA7FF]/40",
    };
  }

  return {
    pill: "bg-[#1F3A2E] text-[#CFFFE1]",
    glow: "bg-[#39FF88]",
    border: "border-[#1F3A2E]",
  };
}


function shortenUrl(url: string) {
  if (!url) return "No URL captured";

  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.length > 70 ? `${url.slice(0, 70)}...` : url;
  }
}

export default function RealGhostReplayPage() {
  const params = useParams();
  const id = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  async function fetchReplayData() {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      const data = await res.json();

      if (data.success) {
        setSession(data.session);
        setEvents(data.events || []);
      } else {
        setMessage(data.message || "Replay session not found");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load Ghost Replay");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReplayData();
  }, []);

  useEffect(() => {
    if (!playing || events.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= events.length - 1) {
          setPlaying(false);
          return prev;
        }

        return prev + 1;
      });
    }, 1300);

    return () => clearInterval(timer);
  }, [playing, events.length]);

  const currentEvent = events[currentIndex];

  const progress = useMemo(() => {
    if (events.length === 0) return 0;
    return ((currentIndex + 1) / events.length) * 100;
  }, [currentIndex, events.length]);

  const replayStats = useMemo(() => {
    return {
      clicks: events.filter((event) => event.type === "click").length,
      errors: events.filter((event) => event.type === "console_error").length,
      networkFails: events.filter((event) => event.type === "network_fail")
        .length,
      routes: events.filter((event) => event.type === "route_change").length,
    };
  }, [events]);

  function resetReplay() {
    setPlaying(false);
    setCurrentIndex(0);
  }

  if (loading) {
    return <p className="text-[#7F9B8B]">Loading Ghost Replay...</p>;
  }

  if (!session) {
    return (
      <div>
        <Link
          href="/dashboard/sessions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88]"
        >
          <ArrowLeft size={16} />
          Back to sessions
        </Link>

        <div className="rounded-2xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-6 text-[#FF4D4D]">
          {message || "Replay session not found"}
        </div>
      </div>
    );
  }

  const currentTone = currentEvent ? getEventTone(currentEvent.type) : null;

  return (
    <div>
      <Link
        href={`/dashboard/sessions/${id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to session detail
      </Link>

      <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">REAL GHOST REPLAY</p>

          <h1 className="font-display mt-3 text-4xl font-bold">
            {session.projectName || "Connected Website"}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-[#7F9B8B]">
            Replaying the real captured browser timeline from this session.
            Each step is generated from saved tracker events.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex h-11 items-center rounded-full bg-[#39FF88]/10 px-5 text-sm font-bold text-[#39FF88]">
            {events.length} replay steps
          </span>

          {session.hasError && (
            <span className="inline-flex h-11 items-center rounded-full bg-[#FF4D4D]/10 px-5 text-sm font-bold text-[#FF4D4D]">
              Error captured
            </span>
          )}

          <span className="inline-flex h-11 items-center rounded-full bg-[#FFB84D]/10 px-5 text-sm font-bold capitalize text-[#FFB84D]">
            {session.autoSeverity || "low"}
          </span>
        </div>
      </header>

      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
            Clicks
          </p>
          <p className="mt-3 text-4xl font-bold text-[#39FF88]">
            {replayStats.clicks}
          </p>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
            Console Errors
          </p>
          <p className="mt-3 text-4xl font-bold text-[#FF4D4D]">
            {replayStats.errors}
          </p>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
            Network Fails
          </p>
          <p className="mt-3 text-4xl font-bold text-[#FFB84D]">
            {replayStats.networkFails}
          </p>
        </div>

        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
            Route Changes
          </p>
          <p className="mt-3 text-4xl font-bold text-[#3BA7FF]">
            {replayStats.routes}
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_430px]">
        <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Replay Window
              </h2>
              <p className="mt-2 text-sm text-[#7F9B8B]">
                Clean visual reconstruction of the captured timeline.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPlaying((prev) => !prev)}
                disabled={events.length === 0}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#39FF88] px-5 text-sm font-bold text-[#031008] transition hover:scale-[1.02] disabled:opacity-50"
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
                {playing ? "Pause" : "Play"}
              </button>

              <button
                onClick={resetReplay}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
              >
                <RotateCcw size={17} />
                Reset
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-[#7F9B8B]">
              <span>
                Step {events.length === 0 ? 0 : currentIndex + 1} of{" "}
                {events.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#050807]">
              <div
                className="h-full rounded-full bg-[#39FF88] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="relative min-h-[500px] overflow-hidden rounded-3xl border border-[#1F3A2E] bg-[#020403] p-6">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-[#39FF88]/20 blur-3xl" />
              <div className="absolute bottom-[10%] right-[8%] h-32 w-32 rounded-full bg-[#3BA7FF]/20 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512] p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                  Current URL
                </p>

                <p
                  title={currentEvent?.url || ""}
                  className="mt-3 break-words text-sm leading-6 text-[#CFFFE1]"
                >
                  {shortenUrl(currentEvent?.url || "")}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512] p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                  Browser
                </p>
                <p className="mt-3 text-sm font-bold text-[#CFFFE1]">
                  {session.browser} / {session.os}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512] p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                  Screen
                </p>
                <p className="mt-3 text-sm font-bold text-[#CFFFE1]">
                  {session.screenSize || "Unknown"}
                </p>
              </div>
            </div>

            {currentEvent && currentTone ? (
              <>
               

                <div className="absolute bottom-6 left-6 right-6 z-20 rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/95 p-6 backdrop-blur">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#39FF88]/10 px-3 py-1 text-xs font-bold text-[#39FF88]">
                      Step {currentIndex + 1} of {events.length}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${currentTone.pill}`}
                    >
                      {currentEvent.type}
                    </span>

                    <span className="rounded-full bg-[#1F3A2E] px-3 py-1 text-xs font-bold text-[#7F9B8B]">
                      {new Date(currentEvent.timestamp).toLocaleTimeString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold">
                    {getEventTitle(currentEvent)}
                  </h3>

                  <p className="mt-2 text-base leading-7 text-[#F3FFF8]">
                    {getEventSummary(currentEvent)}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#7F9B8B]">
                    {getReplayMessage(currentEvent)}
                  </p>
                </div>
              </>
            ) : (
              <div className="relative z-10 flex min-h-[330px] items-center justify-center rounded-2xl border border-[#1F3A2E] bg-[#050807] text-[#7F9B8B]">
                No replay events found.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-8">
          <GenerateReportButton sessionId={id} />

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <h2 className="font-display text-2xl font-bold">Replay Steps</h2>

            <div className="mt-6 max-h-[560px] space-y-4 overflow-auto pr-2">
              {events.map((event, index) => {
               const active = index === currentIndex;
               const tone = getEventTone(event.type);

                return (
                  <button
                    key={event._id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setPlaying(false);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#39FF88] bg-[#39FF88]/10"
                        : "border-[#1F3A2E] bg-[#050807] hover:border-[#39FF88]/50"
                    }`}
                  >
                    <div className="flex gap-4">
                    <div
  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
    active
      ? "bg-[#39FF88] text-[#031008]"
      : "bg-[#1F3A2E] text-[#CFFFE1]"
  }`}
>
  {index + 1}
</div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#7F9B8B]">
                          Step {index + 1}
                        </p>

                        <p className="mt-1 font-bold text-[#F3FFF8]">
                          {getEventTitle(event)}
                        </p>

                        <p className="mt-1 max-h-12 overflow-hidden text-sm leading-6 text-[#7F9B8B]">
                          {getEventSummary(event)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-[#FFB84D]/30 bg-[#FFB84D]/10 p-7">
            <div className="mb-4 flex items-center gap-3 text-[#FFB84D]">
              <AlertTriangle size={22} />
              <h2 className="font-display text-xl font-bold">Replay Note</h2>
            </div>

            <p className="text-sm leading-7 text-[#FFE0A3]">
              This replay is reconstructed from tracker events. It shows the
              timeline, clicked elements, failed requests, routes, and console
              errors captured from the real session.
            </p>

            <div className="mt-6 grid gap-3">
              <Link
                href={`/dashboard/sessions/${id}`}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#FFB84D]/40 text-sm font-bold text-[#FFB84D] transition hover:bg-[#FFB84D]/10"
              >
                View full session timeline
              </Link>

              <Link
                href={`/dashboard/reports`}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
              >
                <ExternalLink size={16} />
                Open bug reports
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}