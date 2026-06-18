import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";
import BugReport from "@/models/BugReport";
import Project from "@/models/Project";

async function getLoggedInUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("rewind_session")?.value;

  if (!sessionToken) {
    return null;
  }

  await connectDB();

  const user = await User.findOne({ sessionToken });
  return user;
}

async function resolveProjectName(session: any) {
  if (session.projectName && session.projectName !== "undefined") {
    return session.projectName;
  }

  if (session.projectId) {
    const project = await Project.findById(session.projectId);

    if (project?.name) {
      return project.name;
    }
  }

  return "Connected Website";
}

function buildReportFromSession(session: any, projectName: string) {
  const severity =
    session.autoSeverity === "critical" || session.autoSeverity === "high"
      ? session.autoSeverity
      : session.hasError
      ? "high"
      : "low";

  const title = session.hasError
    ? `${projectName} session contains errors or failed requests`
    : `${projectName} session captured successfully`;

  const summary = session.hasError
    ? `A user session from ${projectName} captured ${session.eventCount} browser event(s) and contains errors or failed network activity. The issue should be reviewed using the session timeline and replay data.`
    : `A user session from ${projectName} captured ${session.eventCount} browser event(s) without detected errors.`;

  const stepsToReproduce = [
    `Open the connected website: ${projectName}.`,
    "Start a new browser session using the Rewind.dev tracker.",
    `Perform the user actions captured in session token ${session.sessionToken}.`,
    session.hasError
      ? "Trigger the same interaction that caused the error or failed request."
      : "Review the captured user interaction flow.",
    "Open the session in Rewind.dev and inspect the event timeline.",
  ];

  const technicalEvidence = [
    `Project: ${projectName}`,
    `Session token: ${session.sessionToken}`,
    `Browser: ${session.browser}`,
    `OS: ${session.os}`,
    `Device: ${session.device}`,
    `Screen size: ${session.screenSize || "Unknown"}`,
    `Events captured: ${session.eventCount}`,
    `Has error: ${session.hasError ? "Yes" : "No"}`,
    `Auto severity: ${session.autoSeverity || "low"}`,
  ];

  const suggestedFix = session.hasError
    ? "Inspect the captured session timeline, identify the failing event or API request, add defensive error handling, and validate the affected user flow again."
    : "No urgent fix required. Use this session as a clean baseline for comparison with future error sessions.";

  return {
    title,
    summary,
    severity,
    status: "open",
    stepsToReproduce,
    technicalEvidence,
    suggestedFix,
  };
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await connectDB();

    const session = await Session.findById(id);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      );
    }

    const projectName = await resolveProjectName(session);
    const reportData = buildReportFromSession(session, projectName);

    const report = await BugReport.create({
      ownerEmail: user.email,
      projectId: session.projectId,
      projectName,
      sessionId: session._id,
      trackingKey: session.trackingKey,
      ...reportData,
    });

    return NextResponse.json({
      success: true,
      message: "Bug report generated successfully",
      report,
    });
  } catch (error) {
    console.error("Generate report error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate bug report" },
      { status: 500 }
    );
  }
}