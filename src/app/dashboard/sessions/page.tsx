"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bug,
  Clock3,
  Monitor,
  MousePointerClick,
  PlayCircle,
  Search,
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

type FilterType = "all" | "error" | "clean" | "high";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchSessions() {
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();

      if (data.success) {
        setSessions(data.sessions);
      } else {
        setMessage(data.message || "Failed to load sessions");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "error" && session.hasError) ||
        (activeFilter === "clean" && !session.hasError) ||
        (activeFilter === "high" &&
          (session.autoSeverity === "high" ||
            session.autoSeverity === "critical"));

      const matchesSearch =
        query.length === 0 ||
        session.projectName.toLowerCase().includes(query) ||
        session.sessionToken.toLowerCase().includes(query) ||
        session.browser.toLowerCase().includes(query) ||
        session.os.toLowerCase().includes(query) ||
        session.device.toLowerCase().includes(query) ||
        session.screenSize?.toLowerCase().includes(query) ||
        session.autoSeverity?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [sessions, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: sessions.length,
      error: sessions.filter((session) => session.hasError).length,
      clean: sessions.filter((session) => !session.hasError).length,
      high: sessions.filter(
        (session) =>
          session.autoSeverity === "high" ||
          session.autoSeverity === "critical"
      ).length,
    };
  }, [sessions]);

  function filterButtonClass(filter: FilterType) {
    const active = activeFilter === filter;

    return `inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-bold transition ${
      active
        ? "border-[#39FF88] bg-[#39FF88]/10 text-[#39FF88]"
        : "border-[#1F3A2E] bg-[#050807] text-[#7F9B8B] hover:border-[#39FF88]/60 hover:text-[#39FF88]"
    }`;
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-bold text-[#39FF88]">SESSIONS</p>

        <h1 className="font-display mt-2 text-4xl font-bold">
          Captured Sessions
        </h1>

        <p className="mt-2 max-w-2xl text-[#7F9B8B]">
          Real user sessions captured by your Rewind.dev tracker SDK.
        </p>
      </header>

      <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
              <PlayCircle size={22} />
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                Recent Sessions
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                Click a session to inspect captured clicks, page loads, console
                errors, and network failures.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={filterButtonClass("all")}
            >
              All {counts.all}
            </button>

            <button
              onClick={() => setActiveFilter("error")}
              className={filterButtonClass("error")}
            >
              Error {counts.error}
            </button>

            <button
              onClick={() => setActiveFilter("clean")}
              className={filterButtonClass("clean")}
            >
              Clean {counts.clean}
            </button>

            <button
              onClick={() => setActiveFilter("high")}
              className={filterButtonClass("high")}
            >
              High {counts.high}
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#1F3A2E] bg-[#050807]/70 p-5">
          <label className="mb-3 block text-sm font-bold text-[#CFFFE1]">
            Search sessions
          </label>

          <div className="relative w-full">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7F9B8B]"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by website name, browser, OS, device, severity, or session token..."
              className="h-[52px] w-full rounded-xl border border-[#1F3A2E] bg-[#020403] py-4 pl-12 pr-4 text-sm text-[#F3FFF8] outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
            />
          </div>

          {searchQuery.trim() && (
            <p className="mt-3 text-sm text-[#7F9B8B]">
              Showing{" "}
              <span className="font-bold text-[#39FF88]">
                {filteredSessions.length}
              </span>{" "}
              result(s) for{" "}
              <span className="font-bold text-[#CFFFE1]">
                “{searchQuery}”
              </span>
            </p>
          )}
        </div>

        {message && (
          <p className="mb-5 rounded-xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-3 text-sm text-[#FF4D4D]">
            {message}
          </p>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-8 text-center text-[#7F9B8B]">
            Loading sessions...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-10 text-center">
            <MousePointerClick className="mx-auto text-[#39FF88]" size={34} />

            <h3 className="mt-4 font-display text-xl font-bold">
              No sessions found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F9B8B]">
              {searchQuery.trim()
                ? "No sessions match your search."
                : activeFilter === "error"
                ? "No error sessions found."
                : activeFilter === "clean"
                ? "No clean sessions found."
                : activeFilter === "high"
                ? "No high severity sessions found."
                : "Open your test app, click around, trigger an error, then come back here."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredSessions.map((session) => (
              <Link
                key={session._id}
                href={`/dashboard/sessions/${session._id}`}
                className="block rounded-2xl border border-[#1F3A2E] bg-[#050807]/85 p-5 transition hover:border-[#39FF88]/60 hover:bg-[#07100B]"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2 text-[#39FF88]">
                      <Monitor size={17} />

                      <p className="text-xs font-bold uppercase tracking-wide">
                        {session.projectName}
                      </p>
                    </div>

                    <h3 className="font-display text-xl font-bold">
                      Session {session.sessionToken.slice(0, 18)}...
                    </h3>

                    <p className="mt-2 text-sm text-[#7F9B8B]">
                      {session.browser} · {session.os} · {session.device} ·{" "}
                      {session.screenSize || "Unknown screen"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#39FF88]/10 px-5 text-sm font-bold text-[#39FF88]">
                      {session.eventCount} events
                    </span>

                    {session.hasError ? (
                      <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#FF4D4D]/10 px-5 text-sm font-bold text-[#FF4D4D]">
                        Error
                      </span>
                    ) : (
                      <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#3BA7FF]/10 px-5 text-sm font-bold text-[#3BA7FF]">
                        Clean
                      </span>
                    )}

                    {session.autoSeverity && (
                      <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#FFB84D]/10 px-5 text-sm font-bold capitalize text-[#FFB84D]">
                        {session.autoSeverity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7F9B8B]">
                      <Clock3 size={15} />

                      <p className="text-xs font-bold uppercase">Started</p>
                    </div>

                    <p className="text-sm text-[#CFFFE1]">
                      {new Date(session.startedAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7F9B8B]">
                      <Bug size={15} />

                      <p className="text-xs font-bold uppercase">Errors</p>
                    </div>

                    <p
                      className={`text-sm font-bold ${
                        session.hasError ? "text-[#FF4D4D]" : "text-[#39FF88]"
                      }`}
                    >
                      {session.hasError ? "Detected" : "None"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[#7F9B8B]">
                      <AlertTriangle size={15} />

                      <p className="text-xs font-bold uppercase">Severity</p>
                    </div>

                    <p className="text-sm font-bold capitalize text-[#FFB84D]">
                      {session.autoSeverity || "low"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}