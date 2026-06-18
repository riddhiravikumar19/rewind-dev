"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Code2,
  Copy,
  Eye,
  Globe2,
  MousePointerClick,
  Network,
  PlayCircle,
  Route,
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
  endedAt: string | null;
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
  if (type === "route_change") return Route;
  return Code2;
}

function getEventColor(type: string) {
  if (type === "console_error") return "text-[#FF4D4D] bg-[#FF4D4D]/10";
  if (type === "network_fail") return "text-[#FFB84D] bg-[#FFB84D]/10";
  if (type === "click") return "text-[#39FF88] bg-[#39FF88]/10";
  if (type === "page_load") return "text-[#3BA7FF] bg-[#3BA7FF]/10";
  return "text-[#CFFFE1] bg-[#1F3A2E]/60";
}

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

  if (event.type === "page_load") return payload.title || "Page loaded";

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

export default function SessionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchSessionDetail() {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      const data = await res.json();

      if (data.success) {
        setSession(data.session);
        setEvents(data.events || []);
      } else {
        setMessage(data.message || "Session not found");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load session detail");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessionDetail();
  }, []);

  const importantCounts = useMemo(() => {
    return {
      clicks: events.filter((event) => event.type === "click").length,
      errors: events.filter((event) => event.type === "console_error").length,
      networkFails: events.filter((event) => event.type === "network_fail")
        .length,
    };
  }, [events]);

  async function copySessionToken() {
    if (!session) return;

    await navigator.clipboard.writeText(session.sessionToken);
    setMessage("Session token copied");
  }

  if (loading) {
    return (
      <div>
        <p className="text-[#7F9B8B]">Loading session...</p>
      </div>
    );
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
          {message || "Session not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/sessions"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to sessions
      </Link>

      <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">SESSION DETAIL</p>

          <h1 className="font-display mt-3 text-4xl font-bold">
            {session.projectName || "Connected Website"}
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-[#7F9B8B]">
            Inspect the exact timeline of clicks, page loads, console errors,
            and network failures.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex h-11 items-center justify-center rounded-full bg-[#39FF88]/10 px-5 text-sm font-bold text-[#39FF88]">
            {session.eventCount} events
          </span>

          {session.hasError ? (
            <span className="inline-flex h-11 items-center justify-center rounded-full bg-[#FF4D4D]/10 px-5 text-sm font-bold text-[#FF4D4D]">
              Error
            </span>
          ) : (
            <span className="inline-flex h-11 items-center justify-center rounded-full bg-[#3BA7FF]/10 px-5 text-sm font-bold text-[#3BA7FF]">
              Clean
            </span>
          )}

          <span className="inline-flex h-11 items-center justify-center rounded-full bg-[#FFB84D]/10 px-5 text-sm font-bold capitalize text-[#FFB84D]">
            {session.autoSeverity || "low"}
          </span>

          <Link
            href={`/dashboard/replay/${id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#39FF88]/40 bg-[#39FF88]/10 px-5 text-sm font-bold text-[#39FF88] transition hover:bg-[#39FF88]/20"
          >
            <Eye size={17} />
            View Ghost Replay
          </Link>
        </div>
      </header>

      {message && (
        <p className="mb-8 rounded-xl border border-[#1F3A2E] bg-[#050807] p-4 text-center text-sm text-[#39FF88]">
          {message}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
              <PlayCircle size={22} />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">
                Event Timeline
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                Events are ordered from first captured to latest captured.
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-10 text-center text-[#7F9B8B]">
              No events found for this session.
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const colorClass = getEventColor(event.type);

                return (
                  <div
                    key={event._id}
                    className="rounded-3xl border border-[#1F3A2E] bg-[#050807]/85 p-6 transition hover:border-[#39FF88]/50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="flex min-w-0 flex-1 gap-5">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}
                        >
                          <Icon size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-[#1F3A2E] px-3 py-1 text-xs font-bold text-[#7F9B8B]">
                              #{index + 1}
                            </span>

                            <h3 className="font-display text-xl font-bold">
                              {getEventTitle(event)}
                            </h3>
                          </div>

                          <p className="text-base leading-7 text-[#F3FFF8]">
                            {getEventSummary(event)}
                          </p>

                          <p className="mt-3 break-all rounded-xl border border-[#1F3A2E] bg-[#020403] px-4 py-3 text-xs leading-6 text-[#7F9B8B]">
                            {event.url}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex h-10 shrink-0 items-center rounded-full border border-[#1F3A2E] bg-[#020403] px-4 text-xs font-semibold text-[#7F9B8B]">
                        {new Date(event.timestamp).toLocaleTimeString("en-IN")}
                      </span>
                    </div>

                    <details className="mt-5 rounded-2xl border border-[#1F3A2E] bg-[#020403] p-4">
                      <summary className="cursor-pointer text-sm font-bold text-[#39FF88]">
                        View payload
                      </summary>

                      <pre className="mt-5 max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-[#050807] p-4 text-xs leading-6 text-[#7F9B8B]">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-8">
          <GenerateReportButton sessionId={id} />

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <h2 className="font-display text-2xl font-bold">Session Info</h2>

            <div className="mt-6 space-y-4 text-sm">
              {[
                ["Browser", session.browser],
                ["OS", session.os],
                ["Device", session.device],
                ["Screen", session.screenSize || "Unknown"],
                ["Started", new Date(session.startedAt).toLocaleString("en-IN")],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-6 rounded-2xl border border-[#1F3A2E] bg-[#050807] px-5 py-4"
                >
                  <span className="text-[#7F9B8B]">{label}</span>
                  <span className="text-right font-bold text-[#CFFFE1]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={copySessionToken}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
            >
              <Copy size={16} />
              Copy session token
            </button>
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <h2 className="font-display text-2xl font-bold">Summary</h2>

            <div className="mt-6 grid gap-5">
              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#39FF88]">
                  <MousePointerClick size={17} />
                  <p className="text-xs font-bold uppercase tracking-wide">
                    Clicks
                  </p>
                </div>

                <p className="text-4xl font-bold">{importantCounts.clicks}</p>
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#FF4D4D]">
                  <Bug size={17} />
                  <p className="text-xs font-bold uppercase tracking-wide">
                    Console Errors
                  </p>
                </div>

                <p className="text-4xl font-bold">{importantCounts.errors}</p>
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#FFB84D]">
                  <AlertTriangle size={17} />
                  <p className="text-xs font-bold uppercase tracking-wide">
                    Network Failures
                  </p>
                </div>

                <p className="text-4xl font-bold">
                  {importantCounts.networkFails}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}