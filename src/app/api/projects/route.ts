import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Session from "@/models/Session";

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

function generateTrackingKey() {
  return `rw_${crypto.randomBytes(16).toString("hex")}`;
}

export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const projects = await Project.find({ ownerEmail: user.email })
      .sort({ createdAt: -1 })
      .lean();

    const projectsWithTrackerStatus = await Promise.all(
      projects.map(async (project: any) => {
        const sessionQuery = {
          ownerEmail: user.email,
          $or: [
            { projectId: project._id },
            { projectName: project.name },
            { trackingKey: project.trackingKey },
          ],
        };

        const [sessionCount, latestSession] = await Promise.all([
          Session.countDocuments(sessionQuery),
          Session.findOne(sessionQuery).sort({ createdAt: -1 }).lean(),
        ]);

        let trackerStatus: "receiving" | "no_data" | "archived" = "no_data";

        if (project.status === "archived") {
          trackerStatus = "archived";
        } else if (sessionCount > 0) {
          trackerStatus = "receiving";
        }

        return {
          ...project,
          _id: project._id.toString(),
          trackerStatus,
          sessionCount,
          lastSessionAt: latestSession?.createdAt || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: projectsWithTrackerStatus,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load websites" },
      { status: 500 }
    );
  }
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

    const body = await req.json();

    if (!body.name || String(body.name).trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Website name is required" },
        { status: 400 }
      );
    }

    const allowedEnvironments = ["development", "staging", "production"];

    if (
      body.environment &&
      !allowedEnvironments.includes(String(body.environment))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid environment" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.create({
      name: String(body.name).trim(),
      description: String(body.description || "").trim(),
      environment: body.environment || "development",
      status: "active",
      trackingKey: generateTrackingKey(),
      ownerEmail: user.email,
    });

    return NextResponse.json({
      success: true,
      message: "Website connected successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to connect website" },
      { status: 500 }
    );
  }
}