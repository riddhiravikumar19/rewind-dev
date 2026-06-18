"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type BugReport = {
  _id: string;
  projectName: string;
  sessionId: string;
  title: string;
  summary: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved";
  stepsToReproduce: string[];
  technicalEvidence: string[];
  suggestedFix: string;
  createdAt: string;
};

type FilterType = "all" | "open" | "in_progress" | "resolved" | "high";

function severityStyle(severity: string) {
  if (severity === "critical") {
    return "bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]/30";
  }

  if (severity === "high") {
    return "bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30";
  }

  if (severity === "medium") {
    return "bg-[#3BA7FF]/15 text-[#3BA7FF] border-[#3BA7FF]/30";
  }

  return "bg-[#39FF88]/15 text-[#39FF88] border-[#39FF88]/30";
}

function statusStyle(status: string) {
  if (status === "resolved") {
    return "bg-[#39FF88]/15 text-[#39FF88] border-[#39FF88]/30";
  }

  if (status === "in_progress") {
    return "bg-[#3BA7FF]/15 text-[#3BA7FF] border-[#3BA7FF]/30";
  }

  return "bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30";
}

export default function ReportsPage() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchReports() {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();

      if (data.success) {
        setReports(data.reports);
      } else {
        setMessage(data.message || "Failed to load reports");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      open: reports.filter((report) => report.status === "open").length,
      high: reports.filter(
        (report) =>
          report.severity === "high" || report.severity === "critical"
      ).length,
      resolved: reports.filter((report) => report.status === "resolved")
        .length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesFilter =
        activeFilter === "all" ||
        report.status === activeFilter ||
        (activeFilter === "high" &&
          (report.severity === "high" || report.severity === "critical"));

      const matchesSearch =
        query.length === 0 ||
        report.projectName.toLowerCase().includes(query) ||
        report.title.toLowerCase().includes(query) ||
        report.summary.toLowerCase().includes(query) ||
        report.severity.toLowerCase().includes(query) ||
        report.status.toLowerCase().includes(query) ||
        report.suggestedFix.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [reports, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: reports.length,
      open: reports.filter((report) => report.status === "open").length,
      in_progress: reports.filter((report) => report.status === "in_progress")
        .length,
      resolved: reports.filter((report) => report.status === "resolved")
        .length,
      high: reports.filter(
        (report) =>
          report.severity === "high" || report.severity === "critical"
      ).length,
    };
  }, [reports]);

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
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">BUG REPORTS</p>

          <h1 className="font-display mt-2 text-4xl font-bold">
            AI Bug Reports
          </h1>

          <p className="mt-2 max-w-2xl text-[#7F9B8B]">
            Generated reports from captured sessions, including reproduction
            steps, technical evidence, and suggested fixes.
          </p>
        </div>

        <Link
          href="/dashboard/sessions"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#39FF88] px-5 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.02]"
        >
          <Sparkles size={16} />
          Generate from session
        </Link>
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <FileText className="text-[#39FF88]" size={22} />
          <p className="mt-4 text-sm text-[#7F9B8B]">Total Reports</p>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <Bug className="text-[#FFB84D]" size={22} />
          <p className="mt-4 text-sm text-[#7F9B8B]">Open Reports</p>
          <p className="mt-2 text-3xl font-bold">{stats.open}</p>
        </div>

        <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <ShieldAlert className="text-[#FF4D4D]" size={22} />
          <p className="mt-4 text-sm text-[#7F9B8B]">High/Critical</p>
          <p className="mt-2 text-3xl font-bold">{stats.high}</p>
        </div>

        <div className="rounded-2xl border border-[#1F3A2E] bg-[#0E1512]/85 p-5">
          <CheckCircle2 className="text-[#39FF88]" size={22} />
          <p className="mt-4 text-sm text-[#7F9B8B]">Resolved</p>
          <p className="mt-2 text-3xl font-bold">{stats.resolved}</p>
        </div>
      </div>

      <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
              <ClipboardList size={22} />
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                Generated Reports
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                Each report is created from real captured session events.
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
              onClick={() => setActiveFilter("open")}
              className={filterButtonClass("open")}
            >
              Open {counts.open}
            </button>

            <button
              onClick={() => setActiveFilter("in_progress")}
              className={filterButtonClass("in_progress")}
            >
              In Progress {counts.in_progress}
            </button>

            <button
              onClick={() => setActiveFilter("resolved")}
              className={filterButtonClass("resolved")}
            >
              Resolved {counts.resolved}
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
            Search bug reports
          </label>

          <div className="relative w-full">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7F9B8B]"
            />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by report title, project, severity, status, summary, or suggested fix..."
              className="h-[52px] w-full rounded-xl border border-[#1F3A2E] bg-[#020403] py-4 pl-12 pr-4 text-sm text-[#F3FFF8] outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
            />
          </div>

          {searchQuery.trim() && (
            <p className="mt-3 text-sm text-[#7F9B8B]">
              Showing{" "}
              <span className="font-bold text-[#39FF88]">
                {filteredReports.length}
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
            Loading reports...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-10 text-center">
            <AlertTriangle className="mx-auto text-[#39FF88]" size={34} />

            <h3 className="mt-4 font-display text-xl font-bold">
              No bug reports found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F9B8B]">
              {searchQuery.trim()
                ? "No bug reports match your search."
                : activeFilter === "open"
                ? "No open reports found."
                : activeFilter === "in_progress"
                ? "No in-progress reports found."
                : activeFilter === "resolved"
                ? "No resolved reports found."
                : activeFilter === "high"
                ? "No high or critical reports found."
                : "Open a captured session and click Generate AI Bug Report."}
            </p>

            <Link
              href="/dashboard/sessions"
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#39FF88] px-5 text-sm font-bold text-[#031008]"
            >
              Go to sessions
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="rounded-3xl border border-[#1F3A2E] bg-[#050807]/85 p-6 transition hover:border-[#39FF88]/60 hover:bg-[#07100B]"
              >
                <Link
                  href={`/dashboard/reports/${report._id}`}
                  className="block"
                >
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[#39FF88]">
                        <Bug size={17} />
                        <p className="text-xs font-bold uppercase tracking-wide">
                          {report.projectName}
                        </p>
                      </div>

                      <h3 className="font-display text-2xl font-bold">
                        {report.title}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#7F9B8B]">
                        {report.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-bold capitalize ${severityStyle(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>

                      <span
                        className={`inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-bold capitalize ${statusStyle(
                          report.status
                        )}`}
                      >
                        {report.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    <div className="rounded-2xl border border-[#1F3A2E] bg-[#020403] p-5">
                      <h4 className="font-display text-lg font-bold">
                        Steps to Reproduce
                      </h4>

                      <p className="mt-3 text-sm text-[#7F9B8B]">
                        {report.stepsToReproduce.length} captured step(s)
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#1F3A2E] bg-[#020403] p-5">
                      <h4 className="font-display text-lg font-bold">
                        Technical Evidence
                      </h4>

                      <p className="mt-3 text-sm text-[#7F9B8B]">
                        {report.technicalEvidence.length} evidence item(s)
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#1F3A2E] bg-[#020403] p-5">
                      <h4 className="font-display text-lg font-bold">
                        Created
                      </h4>

                      <p className="mt-3 text-sm text-[#7F9B8B]">
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#1F3A2E] pt-5">
                  <p className="text-sm text-[#7F9B8B]">
                    Suggested fix:{" "}
                    <span className="text-[#CFFFE1]">
                      {report.suggestedFix}
                    </span>
                  </p>

                  <Link
                    href={`/dashboard/sessions/${report.sessionId}`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] px-4 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                  >
                    View session
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}