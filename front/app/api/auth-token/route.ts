import { getServerAuthToken } from "@/app/lib/getAuthToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await getServerAuthToken();
  return NextResponse.json(token);
}
