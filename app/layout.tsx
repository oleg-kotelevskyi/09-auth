import React from "react";
import { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
  preload: false,
});

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "NoteHub",
    template: "%s | NoteHub",
  },
  description: "Your ultimate personal note management application.",
  openGraph: {
    title: "NoteHub",
    description: "Your ultimate personal note management application.",
    url: "https://notehub.com",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Application Preview",
      },
    ],
  },
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="uk">
      <body
        className={roboto.className}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <div style={{ flex: 1 }}>{children}</div>
            {modal}
            <Footer />
            <div id="modal-root"></div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
