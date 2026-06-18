"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  CheckCircle2,
  Code2,
  Copy,
  Globe2,
  Keyboard,
  MousePointerClick,
  Radio,
  RefreshCcw,
  ServerCrash,
  Sparkles,
} from "lucide-react";

type LogItem = {
  id: number;
  type: "success" | "error" | "info";
  text: string;
};

export default function TrackerTestPage() {
  const [trackingKey, setTrackingKey] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [displayName, setDisplayName] = useState("Riddhi Developer");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: Date.now(),
      type: "info",
      text: "Enter your tracking key and load the SDK to start testing.",
    },
  ]);

  function addLog(type: LogItem["type"], text: string) {
    setLogs((current) => [
      {
        id: Date.now() + Math.random(),
        type,
        text,
      },
      ...current,
    ]);
  }

  function clearOldRewindSession() {
    const keywords = [
      "rewind",
      "rewind.dev",
      "rewind_session",
      "rewind_session_token",
      "rewind_events",
      "sessionToken",
      "session_token",
    ];
  
    for (const key of Object.keys(localStorage)) {
      if (keywords.some((word) => key.toLowerCase().includes(word.toLowerCase()))) {
        localStorage.removeItem(key);
      }
    }
  
    for (const key of Object.keys(sessionStorage)) {
      if (keywords.some((word) => key.toLowerCase().includes(word.toLowerCase()))) {
        sessionStorage.removeItem(key);
      }
    }
  
    window.dispatchEvent(
      new CustomEvent("rewind:fresh-session", {
        detail: {
          createdAt: new Date().toISOString(),
          source: "tracker-test-page",
        },
      })
    );
  }

  function loadTrackerSdk() {
    const key = trackingKey.trim();
  
    if (!key) {
      addLog("error", "Please paste a tracking key first.");
      return;
    }
  
    clearOldRewindSession();
  
    const existingScript = document.querySelector(
      "script[data-rewind-test-sdk='true']"
    );
  
    if (existingScript) {
      existingScript.remove();
    }
  
    const freshRunId = `run_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
  
    window.history.replaceState(
      {},
      "",
      `/tracker-test?fresh=${freshRunId}`
    );
  
    const script = document.createElement("script");
    script.src = `/rewind-tracker.js?fresh=${freshRunId}`;
    script.async = true;
    script.dataset.projectKey = key;
    script.dataset.rewindTestSdk = "true";
    script.dataset.freshRunId = freshRunId;
  
    script.onload = () => {
      setSdkLoaded(true);
      addLog("success", `Fresh tracker session started with key: ${key}`);
      addLog("info", `Fresh run id: ${freshRunId}`);
    };
  
    script.onerror = () => {
      setSdkLoaded(false);
      addLog("error", "Failed to load /rewind-tracker.js");
    };
  
    document.body.appendChild(script);
  }

  async function copyTestUrl() {
    await navigator.clipboard.writeText("http://localhost:3000/tracker-test");
    addLog("success", "Tracker test page URL copied.");
  }

  function triggerClickEvent() {
    addLog("success", "Click event triggered: #test-click-button");
  }

  function triggerConsoleError() {
    window.dispatchEvent(
      new CustomEvent("rewind:test-error", {
        detail: {
          message:
            "Rewind.dev test error: Cannot read property 'profile' of undefined",
          source: "tracker-test-page",
          severity: "high",
        },
      })
    );
  
    addLog(
      "error",
      "Test error event triggered without crashing the page."
    );
  }

  async function triggerFailedGetApi() {
    addLog("info", "Calling GET /api/tracker-test/fail...");
  
    const res = await fetch("/api/tracker-test/fail");
    const data = await res.json();
  
    if (!res.ok) {
      addLog(
        "error",
        `Real failed GET API captured: ${res.status} - ${data.message}`
      );
      return;
    }
  
    addLog("success", "GET API request completed.");
  }

  async function triggerFailedPostApi() {
    addLog("info", "Calling POST /api/tracker-test/fail...");
  
    const res = await fetch("/api/tracker-test/fail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName,
        notes,
        source: "tracker-test-page",
      }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      addLog(
        "error",
        `Real failed POST API captured: ${res.status} - ${data.message}`
      );
      return;
    }
  
    addLog("success", "POST API request completed.");
  }

  function triggerRouteAction() {
    window.history.pushState({}, "", "/tracker-test?step=profile-save");
    window.dispatchEvent(new PopStateEvent("popstate"));

    addLog(
      "success",
      "Route action triggered: /tracker-test?step=profile-save"
    );
  }

  function triggerFullBugScenario() {
    addLog("info", "Running full bug scenario...");

    setTimeout(() => {
      const button = document.getElementById("test-click-button");
      button?.click();
    }, 300);

    setTimeout(() => {
      setDisplayName("Riddhi Debug Tester");
      addLog("success", "Input changed: display name updated.");
    }, 700);

    setTimeout(() => {
      triggerRouteAction();
    }, 1100);

    setTimeout(() => {
      triggerFailedPostApi();
    }, 1500);

    setTimeout(() => {
      triggerConsoleError();
    }, 2200);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050807] text-[#F3FFF8]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(57,255,136,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,77,77,0.14),transparent_30%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(57,255,136,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,136,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#39FF88] transition hover:underline"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <Link
          href="/dashboard/sessions"
          className="rounded-xl border border-[#1F3A2E] bg-[#0E1512] px-5 py-2 text-sm font-bold text-[#F3FFF8] transition hover:border-[#39FF88] hover:text-[#39FF88]"
        >
          View Sessions
        </Link>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1F3A2E] bg-[#0E1512]/80 px-4 py-2 text-sm font-bold text-[#39FF88]">
            <Radio size={15} />
            Real Tracker Test Page
          </div>

          <h1 className="font-display text-5xl font-black tracking-tight md:text-7xl">
            Generate real captured events.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#7F9B8B]">
            Use this page to test the Rewind.dev tracker with real browser
            actions, console errors, failed API requests, form changes, and
            route actions.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <Code2 size={22} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold">
                    1. Load Tracker SDK
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    Paste a real tracking key from your connected website.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
                <input
                  value={trackingKey}
                  onChange={(e) => setTrackingKey(e.target.value)}
                  placeholder="Paste tracking key, example: rw_abc123..."
                  className="h-12 rounded-xl border border-[#1F3A2E] bg-[#020403] px-4 text-sm text-[#F3FFF8] outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
                />

                <button
                  onClick={loadTrackerSdk}
                  className="h-12 rounded-xl bg-[#39FF88] font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.02]"
                >
                  Load SDK
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                    sdkLoaded
                      ? "bg-[#39FF88]/10 text-[#39FF88]"
                      : "bg-[#7F9B8B]/10 text-[#7F9B8B]"
                  }`}
                >
                  {sdkLoaded ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Radio size={16} />
                  )}
                  {sdkLoaded ? "SDK loaded" : "SDK not loaded"}
                </span>

                <button
                  onClick={copyTestUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1F3A2E] px-4 py-2 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                >
                  <Copy size={15} />
                  Copy test URL
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/90 p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <Keyboard size={22} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold">
                    2. Interact With Test Form
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    These are real input changes and clicks from the browser.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#020403] p-5">
                  <label className="text-sm font-semibold text-[#CFFFE1]">
                    Display name
                  </label>

                  <input
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      addLog("success", "Input changed: display name field.");
                    }}
                    className="mt-3 h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition focus:border-[#39FF88]"
                  />
                </div>

                <div className="rounded-2xl border border-[#1F3A2E] bg-[#020403] p-5">
                  <label className="text-sm font-semibold text-[#CFFFE1]">
                    Notes
                  </label>

                  <input
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      addLog("success", "Input changed: notes field.");
                    }}
                    placeholder="Type anything..."
                    className="mt-3 h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition placeholder:text-[#547064] focus:border-[#39FF88]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/90 p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <MousePointerClick size={22} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold">
                    3. Trigger Real Events
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    Click these buttons and then check your Sessions page.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  id="test-click-button"
                  onClick={triggerClickEvent}
                  className="h-12 rounded-xl border border-[#1F3A2E] bg-[#050807] font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                >
                  Trigger click event
                </button>

                <button
                  onClick={triggerRouteAction}
                  className="h-12 rounded-xl border border-[#1F3A2E] bg-[#050807] font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                >
                  Trigger route action
                </button>

                <button
                  onClick={triggerFailedGetApi}
                  className="h-12 rounded-xl border border-[#FFB84D]/40 bg-[#FFB84D]/10 font-bold text-[#FFB84D] transition hover:bg-[#FFB84D]/15"
                >
                  Trigger failed GET API
                </button>

                <button
                  onClick={triggerFailedPostApi}
                  className="h-12 rounded-xl border border-[#FFB84D]/40 bg-[#FFB84D]/10 font-bold text-[#FFB84D] transition hover:bg-[#FFB84D]/15"
                >
                  Trigger failed POST API
                </button>

                <button
                  onClick={triggerConsoleError}
                  className="h-12 rounded-xl border border-[#FF4D4D]/40 bg-[#FF4D4D]/10 font-bold text-[#FF4D4D] transition hover:bg-[#FF4D4D]/15"
                >
                  Trigger console error
                </button>

                <button
                  onClick={triggerFullBugScenario}
                  className="h-12 rounded-xl bg-[#39FF88] font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.02]"
                >
                  Run full bug scenario
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <Globe2 size={22} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold">
                    Test Flow
                  </h2>

                  <p className="mt-1 text-sm text-[#7F9B8B]">
                    Follow this sequence.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Create a website in Rewind.dev",
                  "Copy the tracking key",
                  "Paste the key here",
                  "Click Load SDK",
                  "Run full bug scenario",
                  "Open Sessions page",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-[#1F3A2E] bg-[#020403] p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#39FF88]/10 text-sm font-bold text-[#39FF88]">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-7 text-[#CFFFE1]">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/90 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFB84D]/10 text-[#FFB84D]">
                  <Bug size={22} />
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold">Event Log</h2>

                  <p className="mt-1 text-sm text-[#7F9B8B]">
                    Local actions from this page.
                  </p>
                </div>
              </div>

              <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`rounded-2xl border p-4 text-sm leading-6 ${
                      log.type === "error"
                        ? "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FFB3B3]"
                        : log.type === "success"
                        ? "border-[#39FF88]/30 bg-[#39FF88]/10 text-[#CFFFE1]"
                        : "border-[#1F3A2E] bg-[#020403] text-[#7F9B8B]"
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#39FF88]/30 bg-[#39FF88]/10 p-6">
              <Sparkles className="text-[#39FF88]" size={28} />

              <h2 className="font-display mt-4 text-xl font-bold">
                After testing
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#7F9B8B]">
                Go to your dashboard. If the tracker captured successfully, the
                session count should increase and the website status can change
                to Receiving data.
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/dashboard/projects"
                  className="flex h-11 items-center justify-center rounded-xl border border-[#1F3A2E] bg-[#050807] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                >
                  Check Websites
                </Link>

                <Link
                  href="/dashboard/sessions"
                  className="flex h-11 items-center justify-center rounded-xl bg-[#39FF88] text-sm font-bold text-[#031008] transition hover:scale-[1.02]"
                >
                  Open Sessions
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}