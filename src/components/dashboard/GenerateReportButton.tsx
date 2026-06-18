"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

type Props = {
  sessionId: string;
};

export default function GenerateReportButton({ sessionId }: Props) {
  const router = useRouter();

  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  async function generateReport() {
    setGenerating(true);
    setMessage("");

    try {
      const res = await fetch(`/api/sessions/${sessionId}/generate-report`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Bug report generated successfully");

        setTimeout(() => {
          router.push(`/dashboard/reports/${data.report._id}`);
        }, 600);
      } else {
        setMessage(data.message || "Failed to generate bug report");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while generating the report");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#39FF88]/30 bg-[#39FF88]/10 p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#39FF88]">
            Generate AI Bug Report
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#A9F5C8]">
            Convert this captured session into a structured bug report with
            reproduction steps, evidence, severity, and suggested fix.
          </p>
        </div>
      </div>

      <button
        onClick={generateReport}
        disabled={generating}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#39FF88] px-5 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles size={17} />
        {generating ? "Generating report..." : "Generate Bug Report"}
      </button>

      {message && (
        <p
          className={`mt-4 rounded-xl border p-3 text-center text-sm ${
            message.includes("success")
              ? "border-[#39FF88]/30 bg-[#050807] text-[#39FF88]"
              : "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}