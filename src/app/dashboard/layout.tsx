// Layout spécifique au Dashboard
// app/(dashboard)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "FORMATEUR") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
}
