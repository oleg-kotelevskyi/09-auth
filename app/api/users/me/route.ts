import { NextResponse } from "next/server";
import { api } from "@/lib/api/api"; 
import { cookies } from "next/headers";
import { logErrorResponse } from "@/app/_utils/utils"; 
import { isAxiosError } from "axios";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data } = await api.get("/users/me", {
      headers: {
        Cookie: `session=${sessionCookie.value}`,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    logErrorResponse(error);
    
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to fetch profile" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { data } = await api.patch("/users/me", body, {
      headers: {
        Cookie: `session=${sessionCookie.value}`,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    logErrorResponse(error);
    
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || "Failed to update profile" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

