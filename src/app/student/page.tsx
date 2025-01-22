// app/student/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Espace Élève</h1>
      <p>Bienvenue, {session?.user.nom}!</p>
      {/* Intégrez ici les composants spécifiques à l'espace élève */}
    </div>
  );
}
