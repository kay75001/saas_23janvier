"use client";

import React, { useEffect } from "react";
import "../globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // If no session => go to /login
    if (!session) {
      router.push("/login");
      return;
    }
    // If role not STUDENT => go to /unauthorized
    if (session.user.role !== "STUDENT") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 flex-1">{children}</main>
      </div>
    </div>
  );
}
