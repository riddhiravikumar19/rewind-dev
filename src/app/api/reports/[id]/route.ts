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

    const report = await BugReport.findOne({
      _id: id,
      projectId: { $in: projectIds },
    }).lean();

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    const project = projects.find(
      (item) => String(item._id) === String(report.projectId)
    );

    return NextResponse.json({
      success: true,
      report: {
        ...report,
        projectName: project?.name || "Unknown Project",
      },
    });
  } catch (error) {
    console.error("Get report detail error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { status } = await req.json();

    const allowedStatuses = ["open", "in_progress", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const projects = await Project.find({ ownerEmail: user.email }).select(
      "_id name"
    );

    const projectIds = projects.map((project) => project._id);

    const report = await BugReport.findOneAndUpdate(
      {
        _id: id,
        projectId: { $in: projectIds },
      },
      { status },
      { new: true }
    ).lean();

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    const project = projects.find(
      (item) => String(item._id) === String(report.projectId)
    );

    return NextResponse.json({
      success: true,
      message: "Report status updated",
      report: {
        ...report,
        projectName: project?.name || "Unknown Project",
      },
    });
  } catch (error) {
    console.error("Update report status error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update report status" },
      { status: 500 }
    );
  }
}