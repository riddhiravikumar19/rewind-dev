import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "This is an intentional test API failure for Rewind.dev tracker.",
      source: "tracker-test-page",
    },
    { status: 500 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Intentional POST failure generated from tracker test page.",
      source: "tracker-test-page",
    },
    { status: 500 }
  );
}