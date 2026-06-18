"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bug,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Lightbulb,
  ShieldAlert,
  Terminal,
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

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<BugReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchReport() {
    try {
      const res = await fetch(`/api/reports/${id}`);
      const data = await res.json();

      if (data.success) {
        setReport(data.report);
      } else {
        setMessage(data.message || "Report not found");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReport();
  }, []);

  const copiedText = useMemo(() => {
    if (!report) return "";

    return `Bug Report: ${report.title}

Project: ${report.projectName}
Severity: ${report.severity}
Status: ${report.status}

Summary:
${report.summary}

Steps to Reproduce:
${report.stepsToReproduce
  .map((step, index) => `${index + 1}. ${step}`)
  .join("\n")}

Technical Evidence:
${report.technicalEvidence.map((item) => `- ${item}`).join("\n")}

Suggested Fix:
${report.suggestedFix}`;
  }, [report]);

  async function updateStatus(newStatus: BugReport["status"]) {
    if (!report) return;

    setMessage("");

    try {
      const res = await fetch(`/api/reports/${report._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReport(data.report);
        setMessage("Report status updated");
      } else {
        setMessage(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating status");
    }
  }

  async function copyReport() {
    if (!report) return;

    await navigator.clipboard.writeText(copiedText);
    setMessage("Report copied to clipboard");
  }

  function downloadReport() {
    if (!report) return;
  
    const blob = new Blob([copiedText], {
      type: "text/plain;charset=utf-8",
    });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
  
    link.href = url;
    link.download = `${report.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-bug-report.txt`;
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(url);
    setMessage("Bug report downloaded");
  }

  if (loading) {
    return (
      <div>
        <p className="text-[#7F9B8B]">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        <Link
          href="/dashboard/reports"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88]"
        >
          <ArrowLeft size={16} />
          Back to reports
        </Link>

        <div className="rounded-2xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-6 text-[#FF4D4D]">
          {message || "Report not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/reports"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to reports
      </Link>

      <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">REPORT DETAIL</p>

          <h1 className="font-display mt-3 max-w-4xl text-4xl font-bold leading-tight">
            {report.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#7F9B8B]">
            {report.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span
            className={`inline-flex h-11 items-center rounded-full border px-5 text-sm font-bold capitalize ${severityStyle(
              report.severity
            )}`}
          >
            {report.severity}
          </span>

          <select
            value={report.status}
            onChange={(e) =>
              updateStatus(e.target.value as BugReport["status"])
            }
            className={`h-11 rounded-full border px-5 text-sm font-bold capitalize outline-none ${statusStyle(
              report.status
            )}`}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={copyReport}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#39FF88] px-5 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.02]"
          >
            <Copy size={16} />
            Copy report
          </button>

          <button
  onClick={downloadReport}
  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
>
  <Download size={16} />
  Download .txt
</button>



        </div>
      </header>

      {message && (
        <p className="mb-8 rounded-xl border border-[#1F3A2E] bg-[#050807] p-4 text-center text-sm text-[#39FF88]">
          {message}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                <ClipboardList size={22} />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold">
                  Steps to Reproduce
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                  Reconstructed from the captured session timeline.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {report.stepsToReproduce.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-5 rounded-2xl border border-[#1F3A2E] bg-[#050807]/85 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#39FF88]/10 text-sm font-bold text-[#39FF88]">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-7 text-[#CFFFE1]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF4D4D]/10 text-[#FF4D4D]">
                <Terminal size={22} />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold">
                  Technical Evidence
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                  Errors and failures extracted from the event stream.
                </p>
              </div>
            </div>

            {report.technicalEvidence.length === 0 ? (
              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/85 p-6 text-[#7F9B8B]">
                No technical evidence captured.
              </div>
            ) : (
              <div className="space-y-5">
                {report.technicalEvidence.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-5 rounded-2xl border border-[#FF4D4D]/20 bg-[#FF4D4D]/10 p-5"
                  >
                    <ShieldAlert
                      size={20}
                      className="mt-1 shrink-0 text-[#FF4D4D]"
                    />

                    <p className="text-sm leading-7 text-[#F3FFF8]">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFB84D]/10 text-[#FFB84D]">
                <Lightbulb size={22} />
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold">
                  Suggested Fix
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                  A developer-facing recommendation based on the captured
                  failure pattern.
                </p>
              </div>
            </div>

            <p className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/85 p-5 text-sm leading-7 text-[#CFFFE1]">
              {report.suggestedFix}
            </p>
          </div>
        </section>

        <aside className="space-y-8">
          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <h2 className="font-display text-2xl font-bold">Report Info</h2>

            <div className="mt-6 space-y-4 text-sm">
              {[
                ["Project", report.projectName],
                ["Severity", report.severity],
                ["Status", report.status.replace("_", " ")],
                [
                  "Created",
                  new Date(report.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-6 rounded-2xl border border-[#1F3A2E] bg-[#050807] px-5 py-4"
                >
                  <span className="text-[#7F9B8B]">{label}</span>

                  <span className="text-right font-bold capitalize text-[#CFFFE1]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-7">
            <h2 className="font-display text-2xl font-bold">Quick Stats</h2>

            <div className="mt-6 grid gap-5">
              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#39FF88]">
                  <ClipboardList size={17} />

                  <p className="text-xs font-bold uppercase tracking-wide">
                    Steps
                  </p>
                </div>

                <p className="text-4xl font-bold">
                  {report.stepsToReproduce.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-5">
                <div className="mb-3 flex items-center gap-2 text-[#FF4D4D]">
                  <Bug size={17} />

                  <p className="text-xs font-bold uppercase tracking-wide">
                    Evidence
                  </p>
                </div>

                <p className="text-4xl font-bold">
                  {report.technicalEvidence.length}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/dashboard/sessions/${report.sessionId}`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] bg-[#050807] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
          >
            View linked session
            <ExternalLink size={16} />
          </Link>

          <Link
            href="/dashboard/reports"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] bg-[#050807] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
          >
            <FileText size={16} />
            All reports
          </Link>
        </aside>
      </div>
    </div>
  );
}