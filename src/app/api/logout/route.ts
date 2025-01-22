import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  // Remove the cookie
  response.cookies.set("authToken", "", { maxAge: 0, path: "/" });
  return response;
}
