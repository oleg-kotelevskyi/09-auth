import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (sessionCookie) {
    try {
      const response = await fetch("https://notehub-api.goit.study", {
        headers: {
          Cookie: `session=${sessionCookie.value}`,
        },
        cache: "no-store",
      });

      if (response.ok && response.status === 200) {
        const user = await response.json();

        if (user && user.email) {
          redirect("/notes/filter/all");
        }
      }
    } catch (error) {
      console.error("Auth proxy session verification failed:", error);
    }
  }

  return <>{children}</>;
}
