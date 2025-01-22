// app/(dashboard)/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function DashboardFormateur() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard Formateur</h1>
      <p>Bienvenue, {session?.user.nom}!</p>
      {/* Intégrez ici les composants spécifiques au dashboard formateur */}
    </div>
  );
}
