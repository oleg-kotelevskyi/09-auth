"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { clientApi } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@/types/user";
import css from "../ProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(() => user?.username || "");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const responseData = await clientApi.updateMe({ username });

      if (responseData) {
        setUser(responseData as unknown as User);
      }

      router.push("/profile");
    } catch (err: unknown) {
      let serverMessage = "Failed to update username. Please try again.";
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as
          { message?: string } | undefined;
        if (responseData?.message) {
          serverMessage = responseData.message;
        }
      }
      setError(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <p style={{ textAlign: "center" }}>Loading user data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p style={{ fontWeight: 500, margin: "8px 0" }}>
            Email: {user.email}
          </p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>

          {error && (
            <p
              style={{
                color: "#dc3545",
                fontSize: "14px",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
