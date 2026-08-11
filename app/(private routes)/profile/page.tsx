import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { serverApi } from "@/lib/api/serverApi";
import { User } from "@/types/user";
import css from "./ProfilePage.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your personal NoteHub profile information.",
  openGraph: {
    title: "My Profile | NoteHub",
    description: "View and manage your personal NoteHub profile information.",
    url: "https://notehub.com",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Profile Page Preview",
      },
    ],
  },
};

export default async function ProfilePage() {
  let user: User | null = null;

  try {
    const responseData = await serverApi.getMe();
    user = responseData as unknown as User;
  } catch (error) {
    console.error("Failed to load user profile on server:", error);
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <p style={{ textAlign: "center", color: "#dc3545" }}>
            Failed to load profile data. Please try logging in again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

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

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
