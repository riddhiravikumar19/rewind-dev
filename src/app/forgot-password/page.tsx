"use client";

import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetLink("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (data.resetLink) {
      setResetLink(data.resetLink);
    }

    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050807] text-[#F3FFF8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(57,255,136,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,77,77,0.12),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(57,255,136,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-[430px] rounded-[28px] border border-[#1F3A2E] bg-[#0B100D]/95 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.75),0_0_60px_rgba(57,255,136,0.08)] backdrop-blur-xl">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1F3A2E] bg-[#050807] text-lg font-bold text-[#39FF88]"
            >
              R
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1F3A2E] bg-[#050807] px-3 py-1.5 text-xs font-bold text-[#39FF88]">
              <ShieldCheck size={13} />
              PASSWORD RESET
            </div>

            <h1 className="font-display text-3xl font-black">
              Forgot password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#7F9B8B]">
              Enter your email address and we’ll generate a secure reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 transition focus-within:border-[#39FF88]">
              <Mail size={18} className="shrink-0 text-[#7F9B8B]" />

              <input
                name="email"
                required
                type="email"
                placeholder="Email address"
                className="h-full flex-1 bg-transparent text-sm text-[#F3FFF8] outline-none placeholder:text-[#7F9B8B]"
              />
            </div>

            <button
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#39FF88] px-5 font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.28)] transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Generating reset link..." : "Send reset link"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 rounded-xl border p-3 text-center text-sm ${
                resetLink
                  ? "border-[#1F3A2E] bg-[#050807] text-[#39FF88]"
                  : "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]"
              }`}
            >
              {message}
            </p>
          )}

          {resetLink && (
            <div className="mt-4 rounded-xl border border-[#1F3A2E] bg-[#050807] p-4">
              <p className="mb-2 text-xs text-[#7F9B8B]">
                Local development reset link:
              </p>

              <Link
                href={resetLink.replace("http://localhost:3000", "")}
                className="break-all text-sm font-bold text-[#39FF88] hover:underline"
              >
                {resetLink}
              </Link>
            </div>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-[#39FF88] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}