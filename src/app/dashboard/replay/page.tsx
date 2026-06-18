"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  Globe2,
  MousePointerClick,
  Network,
  PlayCircle,
  RefreshCcw,
  Terminal,
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
  createdAt: string;
};

type EventItem = {
  _id: string;
  type: string;
  url: string;
  timestamp: string;
  payload: Record<string, any>;
};

function getEventIcon(type: string) {
  if (type === "page_load") return Globe2;
  if (type === "click") return MousePointerClick;
  if (type === "console_error") return Terminal;
  if (type === "network_fail") return Network;
  return Code2;
}

function getEventTitle(event: EventItem) {
  if (event.type === "page_load") return "Page Loaded";
  if (event.type === "click") return "User Click";
  if (event.type === "network_fail") return "Network Failure";
  if (event.type === "console_error") return "Console Error";
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

  if (event.type === "network_fail") {
    return `${payload.url || "Request"} failed with status ${payload.status}`;
  }

  if (event.type === "console_error") {
    if (Array.isArray(payload.message)) {
      return payload.message.join(" ");
    }

    return payload.message || "Console error captured";
  }

  if (event.type === "route_change") {
    return `${payload.from || ""} → ${payload.to || ""}`;
  }

  return "Event captured";
}

function eventColor(type: string) {
  if (type === "console_error") return "text-[#FF4D4D] bg-[#FF4D4D]/10";
  if (type === "network_fail") return "text-[#FFB84D] bg-[#FFB84D]/10";
  if (type === "click") return "text-[#39FF88] bg-[#39FF88]/10";
  if (type === "page_load") return "text-[#3BA7FF] bg-[#3BA7FF]/10";
  return "text-[#CFFFE1] bg-[#1F3A2E]/60";
}

export default function GhostReplayPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchSessions() {
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();

      if (data.success) {
        setSessions(data.sessions);

        if (data.sessions.length > 0) {
          setSelectedSession(data.sessions[0]);
          await fetchSessionEvents(data.sessions[0]._id);
        }
      } else {
        setMessage(data.message || "Failed to load sessions");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load sessions");
    } finally {
      setLoadingSessions(false);
    }
  }

  async function fetchSessionEvents(sessionId: string) {
    setLoadingEvents(true);
    setMessage("");

    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();

      if (data.success) {
        setSelectedSession(data.session);
        setEvents(data.events);
        setCurrentIndex(0);
      } else {
        setMessage(data.message || "Failed to load replay");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load replay");
    } finally {
      setLoadingEvents(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  const currentEvent = events[currentIndex];

  const progress = useMemo(() => {
    if (events.length === 0) return 0;
    return Math.round(((currentIndex + 1) / events.length) * 100);
  }, [currentIndex, events.length]);

  function goPrevious() {
    setCurrentIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setCurrentIndex((current) => Math.min(events.length - 1, current + 1));
  }

  function restartReplay() {
    setCurrentIndex(0);
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">GHOST REPLAY</p>

          <h1 className="font-display mt-2 text-4xl font-bold">
            Replay Captured Sessions
          </h1>

          <p className="mt-2 max-w-2xl text-[#7F9B8B]">
            Step through real user actions, failed API calls, and console errors
            captured by the Rewind.dev tracker.
          </p>
        </div>

        <Link
          href="/dashboard/sessions"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
        >
          <PlayCircle size={16} />
          View all sessions
        </Link>
      </header>

      {message && (
        <p className="mb-6 rounded-xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-3 text-sm text-[#FF4D4D]">
          {message}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold">Sessions</h2>
            <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
              Select a session to replay its timeline.
            </p>
          </div>

          {loadingSessions ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-6 text-center text-sm text-[#7F9B8B]">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-6 text-center text-sm text-[#7F9B8B]">
              No sessions captured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const active = selectedSession?._id === session._id;

                return (
                  <button
                    key={session._id}
                    onClick={() => fetchSessionEvents(session._id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#39FF88] bg-[#39FF88]/10"
                        : "border-[#1F3A2E] bg-[#050807]/80 hover:border-[#39FF88]/60"
                    }`}
                  >
                    <p className="font-bold">{session.projectName}</p>

                    <p className="mt-1 text-sm text-[#7F9B8B]">
                      {session.browser} · {session.os} · {session.device}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#7F9B8B]">
                        {session.eventCount} events
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          session.hasError
                            ? "bg-[#FF4D4D]/15 text-[#FF4D4D]"
                            : "bg-[#39FF88]/15 text-[#39FF88]"
                        }`}
                      >
                        {session.hasError ? "Error" : "Clean"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          {loadingEvents ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-10 text-center text-[#7F9B8B]">
              Loading replay...
            </div>
          ) : !selectedSession || events.length === 0 ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-10 text-center">
              <PlayCircle className="mx-auto text-[#39FF88]" size={34} />

              <h2 className="mt-4 font-display text-2xl font-bold">
                No replay selected
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F9B8B]">
                Select a captured session to see its replay timeline.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#39FF88]">
                    {selectedSession.projectName}
                  </p>

                  <h2 className="font-display mt-2 text-2xl font-bold">
                    Replay Step {currentIndex + 1} of {events.length}
                  </h2>

                  <p className="mt-2 text-sm text-[#7F9B8B]">
                    {selectedSession.browser} · {selectedSession.os} ·{" "}
                    {selectedSession.device} ·{" "}
                    {selectedSession.screenSize || "Unknown screen"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex h-10 items-center rounded-full bg-[#39FF88]/10 px-4 text-sm font-bold text-[#39FF88]">
                    {events.length} events
                  </span>

                  {selectedSession.hasError && (
                    <span className="inline-flex h-10 items-center rounded-full bg-[#FF4D4D]/10 px-4 text-sm font-bold text-[#FF4D4D]">
                      Error session
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between text-xs text-[#7F9B8B]">
                  <span>Replay progress</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#050807]">
                  <div
                    className="h-full rounded-full bg-[#39FF88] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {currentEvent && (
                <div className="rounded-3xl border border-[#1F3A2E] bg-[#050807]/85 p-7">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex gap-5">
                      {(() => {
                        const Icon = getEventIcon(currentEvent.type);
                        return (
                          <div
                            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl ${eventColor(
                              currentEvent.type
                            )}`}
                          >
                            <Icon size={26} />
                          </div>
                        );
                      })()}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                          Current Event
                        </p>

                        <h3 className="font-display mt-2 text-3xl font-bold">
                          {getEventTitle(currentEvent)}
                        </h3>

                        <p className="mt-3 max-w-3xl text-base leading-7 text-[#CFFFE1]">
                          {getEventSummary(currentEvent)}
                        </p>

                        <p className="mt-4 break-all rounded-2xl border border-[#1F3A2E] bg-[#020403] px-4 py-3 text-xs leading-6 text-[#7F9B8B]">
                          {currentEvent.url}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex h-10 shrink-0 items-center rounded-full border border-[#1F3A2E] bg-[#020403] px-4 text-xs font-bold text-[#7F9B8B]">
                      <Clock3 size={14} className="mr-2" />
                      {new Date(currentEvent.timestamp).toLocaleTimeString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <details className="mt-6 rounded-2xl border border-[#1F3A2E] bg-[#020403] p-4">
                    <summary className="cursor-pointer text-sm font-bold text-[#39FF88]">
                      View event payload
                    </summary>

                    <pre className="mt-5 max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-[#050807] p-4 text-xs leading-6 text-[#7F9B8B]">
                      {JSON.stringify(currentEvent.payload, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  onClick={restartReplay}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                >
                  <RefreshCcw size={16} />
                  Restart
                </button>

                <button
                  onClick={goNext}
                  disabled={currentIndex === events.length - 1}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#39FF88] px-5 text-sm font-bold text-[#031008] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mt-8 rounded-2xl border border-[#1F3A2E] bg-[#050807]/70 p-5">
                <h3 className="font-display text-lg font-bold">
                  Mini Timeline
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {events.map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    const active = index === currentIndex;

                    return (
                      <button
                        key={event._id}
                        onClick={() => setCurrentIndex(index)}
                        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-bold transition ${
                          active
                            ? "border-[#39FF88] bg-[#39FF88]/10 text-[#39FF88]"
                            : "border-[#1F3A2E] bg-[#020403] text-[#7F9B8B] hover:border-[#39FF88]/60"
                        }`}
                      >
                        <Icon size={14} />
                        #{index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}