"use client";

import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setMessage(data.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful. Redirecting...");
    setLoading(false);

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050807] text-[#F3FFF8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(57,255,136,0.18),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,77,77,0.12),transparent_28%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(57,255,136,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#1F3A2E] bg-[#0B100D]/95 shadow-[0_30px_100px_rgba(0,0,0,0.75),0_0_60px_rgba(57,255,136,0.08)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden border-r border-[#1F3A2E] bg-[#07100B] p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1F3A2E] text-[#39FF88]">
                  R
                </div>

                <span className="font-display text-2xl font-bold">
                  Rewind.dev
                </span>
              </Link>

              <h1 className="font-display mt-16 max-w-sm text-5xl font-black leading-[1.05]">
                Debug faster with{" "}
                <span className="text-[#39FF88]">AI replay.</span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#7F9B8B]">
                Sign in to inspect sessions, replay bugs, and generate
                production-ready issue reports.
              </p>
            </div>

            <div className="space-y-3 text-sm text-[#CFFFE1]">
              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-4">
                ✓ Ghost Replay timeline
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-4">
                ✓ AI-generated bug reports
              </div>

              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-4">
                ✓ Secure developer dashboard
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-[430px]">
              <div className="mb-8 text-center">
                <Link
                  href="/"
                  className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1F3A2E] bg-[#050807] text-lg font-bold text-[#39FF88] shadow-[0_0_28px_rgba(57,255,136,0.16)] lg:hidden"
                >
                  R
                </Link>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1F3A2E] bg-[#050807] px-3 py-1.5 text-xs font-bold text-[#39FF88]">
                  <ShieldCheck size={13} />
                  WELCOME BACK
                </div>

                <h2 className="font-display text-3xl font-black leading-tight">
                  Sign in to your account
                </h2>

                <p className="mt-3 text-sm text-[#7F9B8B]">
                  New to Rewind.dev?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-[#39FF88] hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 transition focus-within:border-[#39FF88] focus-within:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]">
                  <Mail size={18} className="shrink-0 text-[#7F9B8B]" />

                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="Email address"
                    className="h-full flex-1 bg-transparent text-sm text-[#F3FFF8] outline-none placeholder:text-[#7F9B8B]"
                  />
                </div>

                <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 transition focus-within:border-[#39FF88] focus-within:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-[#7F9B8B]"
                  />

                  <input
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="h-full flex-1 bg-transparent text-sm text-[#F3FFF8] outline-none placeholder:text-[#7F9B8B]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-[#7F9B8B] transition hover:text-[#39FF88]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-[#7F9B8B]">
                    <input type="checkbox" className="accent-[#39FF88]" />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-bold text-[#39FF88] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-[#39FF88] px-5 font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.28)] transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {message && (
                <p
                  className={`mt-4 rounded-xl border p-3 text-center text-sm ${
                    message.includes("successful")
                      ? "border-[#1F3A2E] bg-[#050807] text-[#39FF88]"
                      : "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#1F3A2E] pt-5 text-center text-[11px] text-[#7F9B8B]">
                <p>AI Reports</p>
                <p>Ghost Replay</p>
                <p>PII Safe</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}