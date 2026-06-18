"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  FolderKanban,
  Globe2,
  MousePointerClick,
  PlayCircle,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";

type DashboardStats = {
  totalWebsites: number;
  activeWebsites: number;
  archivedWebsites: number;
  totalSessions: number;
  errorSessions: number;
  cleanSessions: number;
  totalReports: number;
  openReports: number;
  inProgressReports: number;
  resolvedReports: number;
  criticalReports: number;
  highReports: number;
  highOrCriticalReports: number;
};

type RecentSession = {
  _id: string;
  projectName: string;
  sessionToken: string;
  browser: string;
  os: string;
  device: string;
  eventCount: number;
  hasError: boolean;
  autoSeverity: string | null;
  createdAt: string;
};

type RecentReport = {
  _id: string;
  projectName: string;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
};

type DashboardData = {
  stats: DashboardStats;
  recentSessions: RecentSession[];
  recentReports: RecentReport[];
};

const emptyStats: DashboardStats = {
  totalWebsites: 0,
  activeWebsites: 0,
  archivedWebsites: 0,
  totalSessions: 0,
  errorSessions: 0,
  cleanSessions: 0,
  totalReports: 0,
  openReports: 0,
  inProgressReports: 0,
  resolvedReports: 0,
  criticalReports: 0,
  highReports: 0,
  highOrCriticalReports: 0,
};

function statCardClass() {
  return "rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]";
}

function severityClass(severity: string) {
  if (severity === "critical") return "text-[#FF4D4D]";
  if (severity === "high") return "text-[#FFB84D]";
  if (severity === "medium") return "text-[#3BA7FF]";
  return "text-[#39FF88]";
}

function statusClass(status: string) {
  if (status === "resolved") return "text-[#39FF88]";
  if (status === "in_progress") return "text-[#3BA7FF]";
  return "text-[#FFB84D]";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    stats: emptyStats,
    recentSessions: [],
    recentReports: [],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchDashboard() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/dashboard");
      const result = await res.json();

      if (result.success) {
        setData({
          stats: result.stats,
          recentSessions: result.recentSessions || [],
          recentReports: result.recentReports || [],
        });
      } else {
        setMessage(result.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data.stats;

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">OVERVIEW</p>

          <h1 className="font-display mt-2 text-4xl font-bold">
            Rewind Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-[#7F9B8B]">
            Live product metrics from your connected websites, captured
            sessions, and generated bug reports.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </header>

      {message && (
        <p className="mb-6 rounded-xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-3 text-sm text-[#FF4D4D]">
          {message}
        </p>
      )}

      {loading ? (
        <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-10 text-center text-[#7F9B8B]">
          Loading real dashboard stats...
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className={statCardClass()}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <Globe2 size={22} />
                </div>

                <span className="rounded-full bg-[#39FF88]/10 px-3 py-1 text-xs font-bold text-[#39FF88]">
                  {stats.activeWebsites} active
                </span>
              </div>

              <p className="mt-5 text-sm text-[#7F9B8B]">
                Connected Websites
              </p>

              <p className="mt-2 text-4xl font-black">
                {stats.totalWebsites}
              </p>

              <p className="mt-2 text-xs text-[#7F9B8B]">
                {stats.archivedWebsites} archived
              </p>
            </div>

            <div className={statCardClass()}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3BA7FF]/10 text-[#3BA7FF]">
                  <PlayCircle size={22} />
                </div>

                <span className="rounded-full bg-[#3BA7FF]/10 px-3 py-1 text-xs font-bold text-[#3BA7FF]">
                  sessions
                </span>
              </div>

              <p className="mt-5 text-sm text-[#7F9B8B]">
                Captured Sessions
              </p>

              <p className="mt-2 text-4xl font-black">
                {stats.totalSessions}
              </p>

              <p className="mt-2 text-xs text-[#7F9B8B]">
                {stats.cleanSessions} clean sessions
              </p>
            </div>

            <div className={statCardClass()}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFB84D]/10 text-[#FFB84D]">
                  <Bug size={22} />
                </div>

                <span className="rounded-full bg-[#FFB84D]/10 px-3 py-1 text-xs font-bold text-[#FFB84D]">
                  {stats.openReports} open
                </span>
              </div>

              <p className="mt-5 text-sm text-[#7F9B8B]">Bug Reports</p>

              <p className="mt-2 text-4xl font-black">
                {stats.totalReports}
              </p>

              <p className="mt-2 text-xs text-[#7F9B8B]">
                {stats.resolvedReports} resolved
              </p>
            </div>

            <div className={statCardClass()}>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF4D4D]/10 text-[#FF4D4D]">
                  <ShieldAlert size={22} />
                </div>

                <span className="rounded-full bg-[#FF4D4D]/10 px-3 py-1 text-xs font-bold text-[#FF4D4D]">
                  urgent
                </span>
              </div>

              <p className="mt-5 text-sm text-[#7F9B8B]">High/Critical</p>

              <p className="mt-2 text-4xl font-black">
                {stats.highOrCriticalReports}
              </p>

              <p className="mt-2 text-xs text-[#7F9B8B]">
                {stats.criticalReports} critical bugs
              </p>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <AlertTriangle className="text-[#FF4D4D]" size={24} />

              <p className="mt-4 text-sm text-[#7F9B8B]">Error Sessions</p>

              <p className="mt-2 text-3xl font-bold">
                {stats.errorSessions}
              </p>
            </div>

            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <FolderKanban className="text-[#39FF88]" size={24} />

              <p className="mt-4 text-sm text-[#7F9B8B]">In Progress</p>

              <p className="mt-2 text-3xl font-bold">
                {stats.inProgressReports}
              </p>
            </div>

            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <CheckCircle2 className="text-[#39FF88]" size={24} />

              <p className="mt-4 text-sm text-[#7F9B8B]">Resolved Reports</p>

              <p className="mt-2 text-3xl font-bold">
                {stats.resolvedReports}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Recent Sessions
                  </h2>

                  <p className="mt-1 text-sm text-[#7F9B8B]">
                    Latest captured user sessions.
                  </p>
                </div>

                <Link
                  href="/dashboard/sessions"
                  className="text-sm font-bold text-[#39FF88] hover:underline"
                >
                  View all
                </Link>
              </div>

              {data.recentSessions.length === 0 ? (
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-8 text-center">
                  <MousePointerClick
                    className="mx-auto text-[#39FF88]"
                    size={30}
                  />

                  <p className="mt-4 text-sm text-[#7F9B8B]">
                    No sessions captured yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentSessions.map((session) => (
                    <Link
                      key={session._id}
                      href={`/dashboard/sessions/${session._id}`}
                      className="block rounded-2xl border border-[#1F3A2E] bg-[#050807] p-4 transition hover:border-[#39FF88]/60"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#CFFFE1]">
                            {session.projectName}
                          </p>

                          <p className="mt-1 text-xs text-[#7F9B8B]">
                            {session.browser} · {session.os} ·{" "}
                            {session.device}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="rounded-full bg-[#39FF88]/10 px-3 py-1 text-xs font-bold text-[#39FF88]">
                            {session.eventCount} events
                          </span>

                          {session.hasError && (
                            <span className="rounded-full bg-[#FF4D4D]/10 px-3 py-1 text-xs font-bold text-[#FF4D4D]">
                              error
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Recent Bug Reports
                  </h2>

                  <p className="mt-1 text-sm text-[#7F9B8B]">
                    Latest generated AI bug reports.
                  </p>
                </div>

                <Link
                  href="/dashboard/reports"
                  className="text-sm font-bold text-[#39FF88] hover:underline"
                >
                  View all
                </Link>
              </div>

              {data.recentReports.length === 0 ? (
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-8 text-center">
                  <Bug className="mx-auto text-[#39FF88]" size={30} />

                  <p className="mt-4 text-sm text-[#7F9B8B]">
                    No bug reports generated yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentReports.map((report) => (
                    <Link
                      key={report._id}
                      href={`/dashboard/reports/${report._id}`}
                      className="block rounded-2xl border border-[#1F3A2E] bg-[#050807] p-4 transition hover:border-[#39FF88]/60"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#CFFFE1]">
                            {report.title}
                          </p>

                          <p className="mt-1 text-xs text-[#7F9B8B]">
                            {report.projectName}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span
                            className={`rounded-full bg-[#020403] px-3 py-1 text-xs font-bold capitalize ${severityClass(
                              report.severity
                            )}`}
                          >
                            {report.severity}
                          </span>

                          <span
                            className={`rounded-full bg-[#020403] px-3 py-1 text-xs font-bold capitalize ${statusClass(
                              report.status
                            )}`}
                          >
                            {report.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}