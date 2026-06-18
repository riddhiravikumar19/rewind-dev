import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Session from "@/models/Session";
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

    await connectDB();

    const ownerEmail = user.email;

    const [
      totalWebsites,
      activeWebsites,
      archivedWebsites,
      totalSessions,
      errorSessions,
      cleanSessions,
      totalReports,
      openReports,
      inProgressReports,
      resolvedReports,
      criticalReports,
      highReports,
    ] = await Promise.all([
      Project.countDocuments({ ownerEmail }),
      Project.countDocuments({ ownerEmail, status: "active" }),
      Project.countDocuments({ ownerEmail, status: "archived" }),

      Session.countDocuments({ ownerEmail }),
      Session.countDocuments({ ownerEmail, hasError: true }),
      Session.countDocuments({ ownerEmail, hasError: false }),

      BugReport.countDocuments({ ownerEmail }),
      BugReport.countDocuments({ ownerEmail, status: "open" }),
      BugReport.countDocuments({ ownerEmail, status: "in_progress" }),
      BugReport.countDocuments({ ownerEmail, status: "resolved" }),
      BugReport.countDocuments({ ownerEmail, severity: "critical" }),
      BugReport.countDocuments({ ownerEmail, severity: "high" }),
    ]);

    const recentSessions = await Session.find({ ownerEmail })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentReports = await BugReport.find({ ownerEmail })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalWebsites,
        activeWebsites,
        archivedWebsites,
        totalSessions,
        errorSessions,
        cleanSessions,
        totalReports,
        openReports,
        inProgressReports,
        resolvedReports,
        criticalReports,
        highReports,
        highOrCriticalReports: highReports + criticalReports,
      },
      recentSessions,
      recentReports,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}