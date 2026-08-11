"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { clientApi } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export const AuthNavigation = () => {
  const router = useRouter();

  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await clientApi.logout();

      clearIsAuthenticated();

      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email || "User email"}</p>
            <button
              type="button"
              className={css.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default AuthNavigation;
