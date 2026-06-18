import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
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

export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const projects = await Project.find({ ownerEmail: user.email }).select(
      "_id name"
    );

    const projectIds = projects.map((project) => project._id);

    const reports = await BugReport.find({
      projectId: { $in: projectIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const projectMap = new Map(
      projects.map((project) => [String(project._id), project.name])
    );

    const reportsWithProject = reports.map((report) => ({
      ...report,
      projectName: projectMap.get(String(report.projectId)) || "Unknown Project",
    }));

    return NextResponse.json({
      success: true,
      reports: reportsWithProject,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch bug reports" },
      { status: 500 }
    );
  }
}