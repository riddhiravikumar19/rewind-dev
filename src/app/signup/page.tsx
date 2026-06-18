"use client";

import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rules = useMemo(
    () => [
      { label: "8+ characters", ok: password.length >= 8 },
      { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
      { label: "Number", ok: /\d/.test(password) },
      { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const pass = String(formData.get("password"));
    const confirm = String(formData.get("confirmPassword"));

    if (pass !== confirm) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: pass,
      }),
    });

    const data = await res.json();
    setMessage(data.message);
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
              className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1F3A2E] bg-[#050807] text-lg font-bold text-[#39FF88] shadow-[0_0_28px_rgba(57,255,136,0.16)]"
            >
              R
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1F3A2E] bg-[#050807] px-3 py-1.5 text-xs font-bold text-[#39FF88]">
              <Sparkles size={13} />
              START FREE
            </div>

            <h1 className="font-display text-3xl font-black leading-tight">
              Create your account
            </h1>

            <p className="mt-3 text-sm text-[#7F9B8B]">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#39FF88] hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              required
              placeholder="Full name"
              className="h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
            />

            <input
              name="email"
              required
              type="email"
              placeholder="Email address"
              className="h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
            />

            <div className="relative">
              <input
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 pr-12 text-sm outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7F9B8B] hover:text-[#39FF88]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                name="confirmPassword"
                required
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                className="h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 pr-12 text-sm outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7F9B8B] hover:text-[#39FF88]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="rounded-xl border border-[#1F3A2E] bg-[#050807] p-4">
              <p className="mb-3 text-xs font-bold text-[#7F9B8B]">
                Password must include:
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {rules.map((rule) => (
                  <p
                    key={rule.label}
                    className={`text-xs ${
                      rule.ok ? "text-[#39FF88]" : "text-[#7F9B8B]"
                    }`}
                  >
                    {rule.ok ? "✓" : "○"} {rule.label}
                  </p>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 text-xs leading-5 text-[#7F9B8B]">
              <input required type="checkbox" className="mt-1 accent-[#39FF88]" />
              <span>
                I agree to the{" "}
                <span className="text-[#39FF88]">Terms</span> and{" "}
                <span className="text-[#39FF88]">Privacy Policy</span>.
              </span>
            </label>

            <button
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#39FF88] font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.28)] transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 rounded-xl border p-3 text-center text-sm ${
                message.includes("successfully")
                  ? "border-[#1F3A2E] bg-[#050807] text-[#39FF88]"
                  : "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#1F3A2E] pt-5 text-center text-[11px] text-[#7F9B8B]">
            <p>AI Reports</p>
            <p>Ghost Replay</p>
            <p>PII Safe</p>
          </div>
        </div>
      </section>
    </main>
  );
}