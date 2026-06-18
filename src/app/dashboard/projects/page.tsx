"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Copy,
  FolderKanban,
  Globe2,
  Plus,
  Radio,
  Search,
  Server,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";

type Project = {
  _id: string;
  name: string;
  description: string;
  environment: string;
  status: string;
  trackingKey: string;
  createdAt: string;
  trackerStatus?: "receiving" | "no_data" | "archived";
  sessionCount?: number;
  lastSessionAt?: string | null;
};

type FilterType = "all" | "active" | "archived";

export default function ProjectsPage() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setMessage(data.message || "Failed to load websites");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load websites");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === "all" || project.status === activeFilter;

      const matchesSearch =
        query.length === 0 ||
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.environment.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query) ||
        project.trackingKey.toLowerCase().includes(query) ||
        project.trackerStatus?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((project) => project.status === "active").length,
      archived: projects.filter((project) => project.status === "archived")
        .length,
    };
  }, [projects]);

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setCreating(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          environment: formData.get("environment"),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Website connected successfully");
        formRef.current?.reset();
        setActiveFilter("all");
        setSearchQuery("");
        await fetchProjects();
      } else {
        setMessage(data.message || "Failed to connect website");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while connecting the website");
    } finally {
      setCreating(false);
    }
  }

  async function copyKey(e: React.MouseEvent<HTMLButtonElement>, key: string) {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(key);
    setMessage("Tracking key copied");
  }

  function filterButtonClass(filter: FilterType) {
    const active = activeFilter === filter;

    return `inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-bold transition ${
      active
        ? "border-[#39FF88] bg-[#39FF88]/10 text-[#39FF88]"
        : "border-[#1F3A2E] bg-[#050807] text-[#7F9B8B] hover:border-[#39FF88]/60 hover:text-[#39FF88]"
    }`;
  }

  function trackerStatusView(project: Project) {
    if (project.status === "archived" || project.trackerStatus === "archived") {
      return {
        label: "Archived",
        desc: "Tracking paused for archived website",
        icon: WifiOff,
        pillClass: "bg-[#FFB84D]/10 text-[#FFB84D]",
        textClass: "text-[#FFB84D]",
      };
    }

    if (project.trackerStatus === "receiving") {
      return {
        label: "Receiving data",
        desc: `${project.sessionCount || 0} session(s) captured`,
        icon: Wifi,
        pillClass: "bg-[#39FF88]/10 text-[#39FF88]",
        textClass: "text-[#39FF88]",
      };
    }

    return {
      label: "No data yet",
      desc: "Install SDK and open your test website",
      icon: Radio,
      pillClass: "bg-[#7F9B8B]/10 text-[#7F9B8B]",
      textClass: "text-[#7F9B8B]",
    };
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-bold text-[#39FF88]">CONNECTED WEBSITES</p>

        <h1 className="font-display mt-2 text-4xl font-bold">
          Connect Websites
        </h1>

        <p className="mt-2 max-w-2xl text-[#7F9B8B]">
          Connect your existing website or app to Rewind.dev and start capturing
          sessions, errors, and failed API calls.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
              <Plus size={22} />
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                Connect New Website
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                Add an existing website or app and generate a tracking script
                for it.
              </p>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleCreateProject}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              maxWidth: "720px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              <label className="text-sm font-semibold text-[#CFFFE1]">
                Website / App name
              </label>

              <input
                name="name"
                required
                placeholder="AI App Compiler"
                className="h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm text-[#F3FFF8] outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              <label className="text-sm font-semibold text-[#CFFFE1]">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder="Full-stack AI app generator used by developers"
                className="w-full resize-none rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 py-3 text-sm leading-6 text-[#F3FFF8] outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              <label className="text-sm font-semibold text-[#CFFFE1]">
                Environment
              </label>

              <select
                name="environment"
                defaultValue="development"
                className="h-12 w-full rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm text-[#F3FFF8] outline-none transition focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            <button
              disabled={creating}
              className="h-12 w-full rounded-xl bg-[#39FF88] font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Connecting website..." : "Connect website"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-5 rounded-xl border p-3 text-center text-sm ${
                message.includes("success") || message.includes("copied")
                  ? "border-[#1F3A2E] bg-[#050807] text-[#39FF88]"
                  : "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]"
              }`}
            >
              {message}
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                <FolderKanban size={22} />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold">
                  Connected Websites
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#7F9B8B]">
                  Websites and apps currently connected to your Rewind.dev
                  tracker.
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
                onClick={() => setActiveFilter("active")}
                className={filterButtonClass("active")}
              >
                Active {counts.active}
              </button>

              <button
                onClick={() => setActiveFilter("archived")}
                className={filterButtonClass("archived")}
              >
                Archived {counts.archived}
              </button>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-[#1F3A2E] bg-[#050807]/70 p-5">
            <label className="mb-3 block text-sm font-bold text-[#CFFFE1]">
              Search websites
            </label>

            <div className="relative w-full">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7F9B8B]"
              />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by website name"
                className="h-[52px] w-full rounded-xl border border-[#1F3A2E] bg-[#020403] py-4 pl-12 pr-4 text-sm text-[#F3FFF8] outline-none transition placeholder:text-[#547064] focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />
            </div>

            {searchQuery.trim() && (
              <p className="mt-3 text-sm text-[#7F9B8B]">
                Showing{" "}
                <span className="font-bold text-[#39FF88]">
                  {filteredProjects.length}
                </span>{" "}
                result(s) for{" "}
                <span className="font-bold text-[#CFFFE1]">
                  “{searchQuery}”
                </span>
              </p>
            )}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-8 text-center text-[#7F9B8B]">
              Loading websites...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-[#1F3A2E] bg-[#050807] p-10 text-center">
              <ShieldCheck className="mx-auto text-[#39FF88]" size={34} />

              <h3 className="mt-4 font-display text-xl font-bold">
                No websites found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F9B8B]">
                {searchQuery.trim()
                  ? "No websites match your search."
                  : activeFilter === "archived"
                  ? "No archived websites yet."
                  : activeFilter === "active"
                  ? "No active websites found."
                  : "Connect your first website to generate a tracking key and start capturing bugs."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredProjects.map((project) => {
                const tracker = trackerStatusView(project);
                const TrackerIcon = tracker.icon;

                return (
                  <Link
                    href={`/dashboard/projects/${project._id}`}
                    key={project._id}
                    className="block rounded-2xl border border-[#1F3A2E] bg-[#050807]/85 p-5 transition hover:border-[#39FF88]/60 hover:bg-[#07100B]"
                  >
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2 text-[#39FF88]">
                          <Globe2 size={17} />

                          <p className="text-xs font-bold uppercase tracking-wide">
                            Connected Website
                          </p>
                        </div>

                        <h3 className="font-display text-2xl font-bold">
                          {project.name}
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7F9B8B]">
                          {project.description || "No description added"}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <span className="inline-flex h-10 items-center justify-center rounded-full bg-[#39FF88]/10 px-5 text-sm font-bold capitalize text-[#39FF88]">
                          {project.environment}
                        </span>

                        <span
                          className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-bold capitalize ${
                            project.status === "archived"
                              ? "bg-[#FFB84D]/10 text-[#FFB84D]"
                              : "bg-[#3BA7FF]/10 text-[#3BA7FF]"
                          }`}
                        >
                          {project.status}
                        </span>

                        <span
                          className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold ${tracker.pillClass}`}
                        >
                          <TrackerIcon size={15} />
                          {tracker.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1fr_260px_260px]">
                      <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Server size={15} className="text-[#7F9B8B]" />

                          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                            Tracking Key
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <code className="break-all font-mono text-sm text-[#39FF88]">
                            {project.trackingKey}
                          </code>

                          <button
                            onClick={(e) => copyKey(e, project.trackingKey)}
                            className="shrink-0 rounded-lg border border-[#1F3A2E] p-2 text-[#7F9B8B] transition hover:border-[#39FF88] hover:text-[#39FF88]"
                            title="Copy tracking key"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Activity size={15} className="text-[#7F9B8B]" />

                          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                            Website Info
                          </p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="flex justify-between gap-3 text-[#7F9B8B]">
                            Status
                            <span
                              className={`font-bold capitalize ${
                                project.status === "archived"
                                  ? "text-[#FFB84D]"
                                  : "text-[#39FF88]"
                              }`}
                            >
                              {project.status}
                            </span>
                          </p>

                          <p className="flex justify-between gap-3 text-[#7F9B8B]">
                            Created
                            <span className="font-bold text-[#CFFFE1]">
                              {new Date(project.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <TrackerIcon size={15} className={tracker.textClass} />

                          <p className="text-xs font-bold uppercase tracking-wide text-[#7F9B8B]">
                            Tracker Status
                          </p>
                        </div>

                        <p className={`text-sm font-bold ${tracker.textClass}`}>
                          {tracker.label}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#7F9B8B]">
                          {tracker.desc}
                        </p>

                        {project.lastSessionAt && (
                          <p className="mt-2 text-xs text-[#CFFFE1]">
                            Last data:{" "}
                            {new Date(project.lastSessionAt).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}