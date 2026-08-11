"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { clientApi } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@/types/user";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const responseData = await clientApi.login({ email, password });

      if (responseData) {
        setUser(responseData as User);
      }

      router.push("/profile");
    } catch (err: unknown) {
      let serverMessage = "Login failed. Please check your credentials.";

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

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
