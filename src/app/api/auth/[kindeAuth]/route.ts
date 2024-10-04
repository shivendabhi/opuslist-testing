import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { kindeAuth: string } }) {
    const endpoint = params.kindeAuth;
    return handleAuth(request, endpoint) as unknown as Promise<NextResponse>;
}