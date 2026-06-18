import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Session from "@/models/Session";
import Event from "@/models/Event";

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

export async function GET(
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

    const projects = await Project.find({ ownerEmail: user.email }).select(
      "_id name"
    );

    const projectIds = projects.map((project) => project._id);

    const session = await Session.findOne({
      _id: id,
      projectId: { $in: projectIds },
    }).lean();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      );
    }

    const project = projects.find(
      (item) => String(item._id) === String(session.projectId)
    );

    const events = await Event.find({
      sessionId: session._id,
    })
      .sort({ timestamp: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      session: {
        ...session,
        projectName: project?.name || "Unknown Project",
      },
      events,
    });
  } catch (error) {
    console.error("Get session detail error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch session detail" },
      { status: 500 }
    );
  }
}