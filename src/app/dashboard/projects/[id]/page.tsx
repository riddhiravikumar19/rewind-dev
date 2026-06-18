"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowLeft,
  Copy,
  Edit3,
  ExternalLink,
  KeyRound,
  Save,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Project = {
  _id: string;
  name: string;
  description: string;
  environment: string;
  status: string;
  trackingKey: string;
  createdAt: string;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    environment: "development",
  });

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();

      if (data.success) {
        setProject(data.project);
        setEditForm({
          name: data.project.name || "",
          description: data.project.description || "",
          environment: data.project.environment || "development",
        });
      } else {
        setMessage(data.message || "Website not found");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load website");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProject();
  }, []);

  const sdkSnippet = useMemo(() => {
    if (!project) return "";

    return `<script
  src="http://localhost:3000/rewind-tracker.js"
  data-project-key="${project.trackingKey}"
></script>`;
  }, [project]);

  async function copyText(text: string, successMessage: string) {
    await navigator.clipboard.writeText(text);
    setMessage(successMessage);
  }

  function cancelEdit() {
    if (!project) return;

    setEditForm({
      name: project.name || "",
      description: project.description || "",
      environment: project.environment || "development",
    });

    setEditing(false);
    setMessage("");
  }

  async function saveWebsiteDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (data.success) {
        setProject(data.project);
        setEditing(false);
        setMessage("Website updated successfully");
      } else {
        setMessage(data.message || "Failed to update website");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the website");
    } finally {
      setSaving(false);
    }
  }

  async function archiveWebsite() {
    if (!project) return;

    const confirmed = window.confirm(
      "Archive this website? It will remain saved, but its status will change to archived."
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "archived",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProject(data.project);
        setMessage("Website archived successfully");
      } else {
        setMessage(data.message || "Failed to archive website");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while archiving the website");
    }
  }

  async function restoreWebsite() {
    if (!project) return;

    const confirmed = window.confirm(
      "Restore this website? Its status will change back to active."
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "active",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setProject(data.project);
        setMessage("Website restored successfully");
      } else {
        setMessage(data.message || "Failed to restore website");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while restoring the website");
    }
  }

  async function deleteWebsite() {
    if (!project) return;

    const confirmed = window.confirm(
      "Delete this website permanently? This action cannot be undone."
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard/projects");
      } else {
        setMessage(data.message || "Failed to delete website");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting the website");
    }
  }

  if (loading) {
    return (
      <div>
        <p className="text-[#7F9B8B]">Loading website...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <Link
          href="/dashboard/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88]"
        >
          <ArrowLeft size={16} />
          Back to websites
        </Link>

        <div className="rounded-2xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-6 text-[#FF4D4D]">
          {message || "Website not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#39FF88] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to websites
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#39FF88]">WEBSITE SETUP</p>

          <h1 className="font-display mt-2 text-4xl font-bold">
            {project.name}
          </h1>

          <p className="mt-2 max-w-2xl text-[#7F9B8B]">
            {project.description || "No description added"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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

          <button
            onClick={() => setEditing(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#1F3A2E] px-5 text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
          >
            <Edit3 size={15} />
            Edit
          </button>
        </div>
      </header>

      {message && (
        <p
          className={`mb-6 rounded-xl border p-3 text-center text-sm ${
            message.includes("success") ||
            message.includes("copied") ||
            message.includes("updated") ||
            message.includes("archived") ||
            message.includes("restored")
              ? "border-[#1F3A2E] bg-[#050807] text-[#39FF88]"
              : "border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]"
          }`}
        >
          {message}
        </p>
      )}

      {editing && (
        <section className="mb-6 rounded-3xl border border-[#39FF88]/30 bg-[#0E1512]/90 p-6 shadow-[0_20px_80px_rgba(57,255,136,0.08)]">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#39FF88]">EDIT WEBSITE</p>

              <h2 className="font-display mt-2 text-2xl font-bold">
                Update connected website details
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7F9B8B]">
                This will update how the website appears in your dashboard. The
                tracking key will stay the same.
              </p>
            </div>

            <button
              onClick={cancelEdit}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] px-4 text-sm font-bold text-[#CFFFE1] transition hover:border-[#FF4D4D] hover:text-[#FF4D4D]"
            >
              <X size={15} />
              Cancel
            </button>
          </div>

          <form
            onSubmit={saveWebsiteDetails}
            className="grid gap-5 lg:grid-cols-3"
          >
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[#CFFFE1]">
                Website / App name
              </label>

              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                required
                className="h-12 rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[#CFFFE1]">
                Description
              </label>

              <input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                className="h-12 rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[#CFFFE1]">
                Environment
              </label>

              <select
                value={editForm.environment}
                onChange={(e) =>
                  setEditForm((current) => ({
                    ...current,
                    environment: e.target.value,
                  }))
                }
                className="h-12 rounded-xl border border-[#1F3A2E] bg-[#050807] px-4 text-sm outline-none transition focus:border-[#39FF88] focus:shadow-[0_0_0_3px_rgba(57,255,136,0.08)]"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <button
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#39FF88] px-6 text-sm font-bold text-[#031008] shadow-[0_0_28px_rgba(57,255,136,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                <Terminal size={22} />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold">
                  Install Tracking Script
                </h2>

                <p className="mt-1 text-sm text-[#7F9B8B]">
                  Paste this snippet before the closing body tag of your
                  website.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1F3A2E] bg-[#020403] p-5">
              <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm leading-7 text-[#39FF88]">
                {sdkSnippet}
              </pre>
            </div>

            <button
              onClick={() =>
                copyText(sdkSnippet, "SDK snippet copied to clipboard")
              }
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-[#39FF88] px-5 font-bold text-[#031008] transition hover:scale-[1.01]"
            >
              <Copy size={16} />
              Copy snippet
            </button>
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
            <h2 className="font-display text-xl font-bold">Setup Steps</h2>

            <div className="mt-5 space-y-4">
              {[
                "Copy the SDK snippet.",
                "Paste it inside your app's main HTML layout.",
                "Deploy or refresh your website.",
                "Rewind.dev will start receiving captured events.",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-2xl border border-[#1F3A2E] bg-[#050807]/80 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#39FF88]/10 text-sm font-bold text-[#39FF88]">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-7 text-[#CFFFE1]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88]/10 text-[#39FF88]">
                <KeyRound size={22} />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold">
                  Tracking Key
                </h2>

                <p className="mt-1 text-sm text-[#7F9B8B]">
                  Unique key for this connected website.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#1F3A2E] bg-[#020403] p-4">
              <code className="break-all font-mono text-sm text-[#39FF88]">
                {project.trackingKey}
              </code>
            </div>

            <button
              onClick={() =>
                copyText(project.trackingKey, "Tracking key copied")
              }
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
            >
              <Copy size={16} />
              Copy key
            </button>
          </div>

          <div className="rounded-3xl border border-[#1F3A2E] bg-[#0E1512]/85 p-6">
            <h2 className="font-display text-xl font-bold">Website Info</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-[#1F3A2E] pb-3 text-[#7F9B8B]">
                Environment
                <span className="font-bold capitalize text-[#39FF88]">
                  {project.environment}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b border-[#1F3A2E] pb-3 text-[#7F9B8B]">
                Status
                <span
                  className={`font-bold capitalize ${
                    project.status === "archived"
                      ? "text-[#FFB84D]"
                      : "text-[#3BA7FF]"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[#7F9B8B]">
                Created
                <span className="font-bold text-[#CFFFE1]">
                  {new Date(project.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/replay"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#1F3A2E] bg-[#050807] text-sm font-bold text-[#CFFFE1] transition hover:border-[#39FF88] hover:text-[#39FF88]"
          >
            Open Ghost Replay
            <ExternalLink size={16} />
          </Link>

          <div
            className={`rounded-3xl border p-6 ${
              project.status === "archived"
                ? "border-[#39FF88]/30 bg-[#39FF88]/10"
                : "border-[#FFB84D]/30 bg-[#FFB84D]/10"
            }`}
          >
            <div className="mb-5 flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  project.status === "archived"
                    ? "bg-[#39FF88]/10 text-[#39FF88]"
                    : "bg-[#FFB84D]/10 text-[#FFB84D]"
                }`}
              >
                <Archive size={20} />
              </div>

              <div>
                <h2
                  className={`font-display text-xl font-bold ${
                    project.status === "archived"
                      ? "text-[#39FF88]"
                      : "text-[#FFB84D]"
                  }`}
                >
                  {project.status === "archived"
                    ? "Restore Website"
                    : "Archive Website"}
                </h2>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    project.status === "archived"
                      ? "text-[#A9F5C8]"
                      : "text-[#D9B98A]"
                  }`}
                >
                  {project.status === "archived"
                    ? "Bring this website back to active tracking."
                    : "Keep this website saved, but mark it as archived."}
                </p>
              </div>
            </div>

            {project.status === "archived" ? (
              <button
                onClick={restoreWebsite}
                className="h-11 w-full rounded-xl border border-[#39FF88]/40 text-sm font-bold text-[#39FF88] transition hover:bg-[#39FF88]/10"
              >
                Restore website
              </button>
            ) : (
              <button
                onClick={archiveWebsite}
                className="h-11 w-full rounded-xl border border-[#FFB84D]/30 text-sm font-bold text-[#FFB84D] transition hover:bg-[#FFB84D]/10"
              >
                Archive website
              </button>
            )}
          </div>

          <div className="rounded-3xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF4D4D]/10 text-[#FF4D4D]">
                <Trash2 size={20} />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-[#FF4D4D]">
                  Delete Website
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#D99A9A]">
                  Permanently remove this website from Rewind.dev.
                </p>
              </div>
            </div>

            <button
              onClick={deleteWebsite}
              className="h-11 w-full rounded-xl border border-[#FF4D4D]/30 text-sm font-bold text-[#FF4D4D] transition hover:bg-[#FF4D4D]/10"
            >
              Delete website
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}