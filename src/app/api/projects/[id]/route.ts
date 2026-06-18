import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
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

    const project = await Project.findOne({
      _id: id,
      ownerEmail: user.email,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Website not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get website error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load website" },
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
    const body = await req.json();

    const updateData: Record<string, any> = {};

    if (body.name !== undefined) {
      if (!String(body.name).trim() || String(body.name).trim().length < 2) {
        return NextResponse.json(
          { success: false, message: "Website name is required" },
          { status: 400 }
        );
      }

      updateData.name = String(body.name).trim();
    }

    if (body.description !== undefined) {
      updateData.description = String(body.description || "").trim();
    }

    if (body.environment !== undefined) {
      const allowedEnvironments = ["development", "staging", "production"];

      if (!allowedEnvironments.includes(body.environment)) {
        return NextResponse.json(
          { success: false, message: "Invalid environment" },
          { status: 400 }
        );
      }

      updateData.environment = body.environment;
    }

    if (body.status !== undefined) {
      const allowedStatuses = ["active", "archived"];

      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json(
          { success: false, message: "Invalid website status" },
          { status: 400 }
        );
      }

      updateData.status = body.status;
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: id,
        ownerEmail: user.email,
      },
      updateData,
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Website not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Website updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update website error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update website" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const deletedProject = await Project.findOneAndDelete({
      _id: id,
      ownerEmail: user.email,
    });

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: "Website not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Website deleted successfully",
    });
  } catch (error) {
    console.error("Delete website error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete website" },
      { status: 500 }
    );
  }
}