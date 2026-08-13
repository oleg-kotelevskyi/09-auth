export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { logErrorResponse } from "../../_utils/utils";
import { isAxiosError } from "axios";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const { data } = await api.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    logErrorResponse(error, "GET /api/users/me");
    
    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: "Something went wrong" },
        { status: error.response?.status || 500 }
      );
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    
    const { data } = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    logErrorResponse(error, "PATCH /api/users/me");
    
    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: "Something went wrong" },
        { status: error.response?.status || 500 }
      );
    }
  }
}




