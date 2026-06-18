import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();
    const cleanEmail = String(email || "").toLowerCase().trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email" },
        { status: 404 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    return NextResponse.json({
      success: true,
      message: "Password reset link generated",
      resetLink,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate reset link" },
      { status: 500 }
    );
  }
}