import {
    Bell,
    CheckCircle2,
    Database,
    KeyRound,
    Lock,
    Mail,
    MonitorCheck,
    ShieldCheck,
    SlidersHorizontal,
    Trash2,
    User,
  } from "lucide-react";
  
  const trackerSettings = [
    {
      label: "Capture clicks",
      description: "Tracks useful button, link, and interactive element clicks.",
      enabled: true,
    },
    {
      label: "Capture console errors",
      description: "Records frontend runtime errors from connected websites.",
      enabled: true,
    },
    {
      label: "Capture network failures",
      description: "Detects failed API calls, 404s, 500s, and request failures.",
      enabled: true,
    },
    {
      label: "Ignore sensitive fields",
      description: "Passwords, OTPs, tokens, card fields, and secrets are ignored.",
      enabled: true,
    },
  ];
  
  export default function SettingsPage() {
    return (
      <div>
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#39FF88]">SETTINGS</p>
  
            <h1 className="font-display mt-2 text-4xl font-bold">
              Workspace Settings
            </h1>
  
            <p className="mt-2 max-w-2xl text-[#7F9B8B]">
              Manage your Rewind.dev workspace, tracker behavior, privacy mode,
              and account preferences.
            </p>
          </div>
  
          <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#39FF88]/30 bg-[#39FF88]/10 px-5 text-sm font-bold text-[#39FF88]">
            <MonitorCheck size={16} />
            Tracker Active
          </div>
        </header>
  
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <User size={22} />
                </div>
  
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Account Information
                  </h2>
  
                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    Basic account and workspace details for this Rewind.dev setup.
                  </p>
                </div>
              </div>
  
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#7F9B8B]">
                    <Mail size={16} />
                    <p className="text-xs font-bold uppercase tracking-wide">
                      Account Email
                    </p>
                  </div>
  
                  <p className="font-bold text-[#CFFFE1]">
                    Your logged-in account
                  </p>
  
                  <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                    This will be connected dynamically from the user session later.
                  </p>
                </div>
  
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#7F9B8B]">
                    <Database size={16} />
                    <p className="text-xs font-bold uppercase tracking-wide">
                      Workspace
                    </p>
                  </div>
  
                  <p className="font-bold text-[#CFFFE1]">
                    Rewind.dev Workspace
                  </p>
  
                  <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                    Stores connected websites, sessions, events, and bug reports.
                  </p>
                </div>
              </div>
            </div>
  
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <SlidersHorizontal size={22} />
                </div>
  
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Tracker Settings
                  </h2>
  
                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    Current SDK capture behavior for connected websites.
                  </p>
                </div>
              </div>
  
              <div className="grid gap-4">
                {trackerSettings.map((setting) => (
                  <div
                    key={setting.label}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-5"
                  >
                    <div>
                      <p className="font-bold text-[#F3FFF8]">
                        {setting.label}
                      </p>
  
                      <p className="mt-1 max-w-2xl text-sm leading-6 text-[#7F9B8B]">
                        {setting.description}
                      </p>
                    </div>
  
                    <span
                      className={`inline-flex h-10 items-center rounded-full px-5 text-sm font-bold ${
                        setting.enabled
                          ? "bg-[#39FF88]/10 text-[#39FF88]"
                          : "bg-[#FF4D4D]/10 text-[#FF4D4D]"
                      }`}
                    >
                      {setting.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFB84D]/10 text-[#FFB84D]">
                  <ShieldCheck size={22} />
                </div>
  
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Privacy & Safety
                  </h2>
  
                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    Rewind.dev is designed to capture debugging signals without
                    storing sensitive user input.
                  </p>
                </div>
              </div>
  
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-5">
                  <Lock className="text-[#39FF88]" size={22} />
  
                  <p className="mt-4 font-bold">Sensitive fields ignored</p>
  
                  <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                    Passwords, OTPs, tokens, and card fields are not captured by
                    the tracker.
                  </p>
                </div>
  
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-5">
                  <KeyRound className="text-[#39FF88]" size={22} />
  
                  <p className="mt-4 font-bold">Project key based routing</p>
  
                  <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                    Each connected website has a unique tracking key for clean
                    separation.
                  </p>
                </div>
  
                <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-5">
                  <CheckCircle2 className="text-[#39FF88]" size={22} />
  
                  <p className="mt-4 font-bold">Developer-safe events</p>
  
                  <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                    The SDK focuses on clicks, errors, failed requests, and
                    session metadata.
                  </p>
                </div>
              </div>
            </div>
          </section>
  
          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <h2 className="font-display text-xl font-bold">System Status</h2>
  
              <div className="mt-5 space-y-3">
                {[
                  ["MongoDB", "Connected"],
                  ["Tracker SDK", "Active"],
                  ["Event Ingest API", "Running"],
                  ["AI Reports", "Enabled"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 px-5 py-4 text-sm"
                  >
                    <span className="text-[#7F9B8B]">{label}</span>
  
                    <span className="font-bold text-[#39FF88]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                  <Bell size={20} />
                </div>
  
                <div>
                  <h2 className="font-display text-xl font-bold">
                    Notifications
                  </h2>
  
                  <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                    Alerts can be added later for new high-severity reports.
                  </p>
                </div>
              </div>
  
              <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-4 text-sm leading-6 text-[#7F9B8B]">
                Future upgrade: email or dashboard notifications when a new
                critical bug report is generated.
              </div>
            </div>
  
            <div className="rounded-3xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF4D4D]/10 text-[#FF4D4D]">
                  <Trash2 size={20} />
                </div>
  
                <div>
                  <h2 className="font-display text-xl font-bold text-[#FF4D4D]">
                    Danger Zone
                  </h2>
  
                  <p className="mt-1 text-sm leading-6 text-[#D99A9A]">
                    Destructive actions will be added after project archive/delete
                    support.
                  </p>
                </div>
              </div>
  
              <button
                disabled
                className="h-11 w-full cursor-not-allowed rounded-xl border border-[#FF4D4D]/30 text-sm font-bold text-[#FF4D4D] opacity-60"
              >
                Delete workspace disabled
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }