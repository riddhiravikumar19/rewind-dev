import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Session from "@/models/Session";
import Event from "@/models/Event";
import BugReport from "@/models/BugReport";

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

function isNoisyClick(event: any) {
  if (event.type !== "click") return false;

  const text = String(event.payload?.text || "");
  const selector = String(event.payload?.selector || "");
  const tag = String(event.payload?.tag || "");

  if (text.length > 60) return true;

  const usefulTags = ["button", "a", "input", "select", "textarea"];

  if (!usefulTags.includes(tag) && !selector.includes("button")) {
    return true;
  }

  return false;
}

function dedupe(items: string[]) {
  return Array.from(new Set(items));
}

function eventSummary(event: any) {
  const payload = event.payload || {};

  if (event.type === "page_load") {
    return `Page loaded: ${payload.title || event.url}`;
  }

  if (event.type === "click") {
    return `User clicked: ${payload.text || payload.selector || payload.tag}`;
  }

  if (event.type === "network_fail") {
    return `Network request failed: ${
      payload.url || "unknown URL"
    } returned status ${payload.status}`;
  }

  if (event.type === "console_error") {
    const message = Array.isArray(payload.message)
      ? payload.message.join(" ")
      : payload.message;

    return `Console error: ${message || "Unknown console error"}`;
  }

  if (event.type === "route_change") {
    return `Route changed from ${payload.from} to ${payload.to}`;
  }

  return `Captured event: ${event.type}`;
}

function generateTitle(events: any[]) {
  const networkFail = events.find((event) => event.type === "network_fail");
  const consoleError = events.find((event) => event.type === "console_error");

  const meaningfulClick = events.find(
    (event) => event.type === "click" && !isNoisyClick(event)
  );

  if (networkFail && meaningfulClick) {
    return `${
      meaningfulClick.payload?.text || "User action"
    } flow fails due to network error`;
  }

  if (consoleError && meaningfulClick) {
    return `${
      meaningfulClick.payload?.text || "User action"
    } triggers console error`;
  }

  if (networkFail) {
    return "Network request failure detected during session";
  }

  if (consoleError) {
    return "Console error detected during user session";
  }

  return "User session issue detected";
}

function generateSeverity(events: any[]) {
  const hasConsoleError = events.some((event) => event.type === "console_error");

  const hasServerError = events.some(
    (event) =>
      event.type === "network_fail" && Number(event.payload?.status || 0) >= 500
  );

  const hasNetworkFail = events.some((event) => event.type === "network_fail");

  if (hasServerError) return "critical";
  if (hasConsoleError && hasNetworkFail) return "high";
  if (hasConsoleError || hasNetworkFail) return "medium";

  return "low";
}

function generateSuggestedFix(events: any[]) {
  const networkFail = events.find((event) => event.type === "network_fail");
  const consoleError = events.find((event) => event.type === "console_error");

  if (networkFail && consoleError) {
    return "Check the failing API endpoint, validate the response shape, and add defensive error handling before using payment/session objects in the frontend.";
  }

  if (networkFail) {
    return "Verify that the API route exists, returns the expected status code, and is correctly wired to the frontend request.";
  }

  if (consoleError) {
    return "Inspect the frontend component or handler where the error is thrown and add validation before accessing undefined values.";
  }

  return "Review the captured timeline and inspect the related frontend interaction.";
}

export async function POST(req: Request) {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Session ID is required" },
        { status: 400 }
      );
    }

    const projects = await Project.find({ ownerEmail: user.email }).select(
      "_id name"
    );

    const projectIds = projects.map((project) => project._id);

    const session = await Session.findOne({
      _id: sessionId,
      projectId: { $in: projectIds },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      );
    }

    const events = await Event.find({
      sessionId: session._id,
    }).sort({ timestamp: 1 });

    if (events.length === 0) {
      return NextResponse.json(
        { success: false, message: "No events found for this session" },
        { status: 400 }
      );
    }

    await BugReport.deleteOne({
      sessionId: session._id,
    });

    const cleanEvents = events.filter((event) => !isNoisyClick(event));

    const importantEvents = cleanEvents.filter((event) =>
      ["page_load", "click", "network_fail", "console_error"].includes(
        event.type
      )
    );

    const title = generateTitle(cleanEvents);
    const severity = generateSeverity(cleanEvents);

    const stepsToReproduce = dedupe(
      importantEvents.slice(0, 8).map((event) => eventSummary(event))
    );

    const technicalEvidence = dedupe(
      cleanEvents
        .filter((event) =>
          ["network_fail", "console_error"].includes(event.type)
        )
        .map((event) => eventSummary(event))
    );

    const projectName =
      projects.find((p) => String(p._id) === String(session.projectId))?.name ||
      "the project";

    const summary =
      technicalEvidence.length > 0
        ? `A user session in ${projectName} captured ${events.length} events, including ${technicalEvidence.length} unique error-related issue(s).`
        : `A user session captured ${events.length} events. No critical technical failure was detected.`;

    const report = await BugReport.create({
      projectId: session.projectId,
      sessionId: session._id,
      trackingKey: session.trackingKey,
      title,
      summary,
      severity,
      stepsToReproduce,
      technicalEvidence,
      suggestedFix: generateSuggestedFix(cleanEvents),
    });

    return NextResponse.json({
      success: true,
      message: "AI bug report generated",
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