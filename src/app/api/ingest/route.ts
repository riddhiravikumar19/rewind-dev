import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Session from "@/models/Session";
import Event from "@/models/Event";

function detectSeverity(type: string, payload: any) {
  if (type === "console_error") return "high";

  if (type === "network_fail") {
    const status = Number(payload?.status || payload?.statusCode || 0);

    if (status >= 500) return "high";
    if (status >= 400) return "medium";
  }

  return "low";
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const trackingKey = String(body.trackingKey || "");
    const sessionToken = String(body.sessionToken || "");
    const events = Array.isArray(body.events) ? body.events : [];
    const metadata = body.metadata || {};

    if (!trackingKey || !sessionToken || events.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "trackingKey, sessionToken and events are required",
        },
        { status: 400 }
      );
    }

    const project = await Project.findOne({
      trackingKey,
      status: "active",
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Invalid tracking key" },
        { status: 401 }
      );
    }

    let session = await Session.findOne({
      trackingKey,
      sessionToken,
    });

    const hasError = events.some(
      (event: any) =>
        event.type === "console_error" || event.type === "network_fail"
    );

    const highestSeverity = events.reduce((current: string | null, event: any) => {
      const severity = detectSeverity(event.type, event.payload);

      if (severity === "high") return "high";
      if (severity === "medium" && current !== "high") return "medium";
      if (!current) return severity;

      return current;
    }, null);

    if (!session) {
      session = await Session.create({
        projectId: project._id,
        trackingKey,
        sessionToken,
        browser: metadata.browser || "Unknown",
        os: metadata.os || "Unknown",
        device: metadata.device || "Desktop",
        screenSize: metadata.screenSize || "",
        hasError,
        autoSeverity: highestSeverity,
      });
    }

    const docs = events.map((event: any) => ({
      sessionId: session._id,
      projectId: project._id,
      trackingKey,
      sessionToken,
      type: event.type,
      url: event.url || "",
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
      payload: event.payload || {},
    }));

    await Event.insertMany(docs);

    session.eventCount += docs.length;
    session.endedAt = new Date();
    session.hasError = session.hasError || hasError;

    if (highestSeverity === "high") {
      session.autoSeverity = "high";
    } else if (!session.autoSeverity && highestSeverity) {
      session.autoSeverity = highestSeverity;
    }

    await session.save();

    return NextResponse.json({
      success: true,
      message: "Events ingested successfully",
      inserted: docs.length,
      sessionId: session._id,
    });
  } catch (error) {
    console.error("Ingest error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to ingest events" },
      { status: 500 }
    );
  }
}