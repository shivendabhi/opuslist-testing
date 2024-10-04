import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { kindeAuth: string } }) {
  const endpoint = params.kindeAuth;
  const authResponse = await handleAuth(request, endpoint);
  
  // Convert the auth response to a NextResponse
  return NextResponse.json(authResponse);
}