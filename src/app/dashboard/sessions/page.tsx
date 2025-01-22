// Pages pour gérer les sessions / planning
"use client";


import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SessionData {
  id_horaire: string;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  // etc.
}

export default function FormateurSessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Vérifier que c'est un formateur
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "FORMATEUR") {
      router.push("/unauthorized");
      return;
    }

    async function fetchSessions() {
      try {
        setLoading(true);
        // On suppose /api/sessions?formateurId=xxx
        const res = await fetch(`/api/sessions?formateurId=${session?.user.id}`);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        setSessions(data.data);
      } catch (err: any) {
        console.error("Erreur fetch sessions:", err);
        setError(err.message || "Erreur lors de la récupération des sessions");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }
  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }
  if (loading) {
    return <p>Chargement des sessions...</p>;
  }
  if (sessions.length === 0) {
    return <p>Aucune session planifiée.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Sessions</h1>
      <div className="bg-white shadow-md rounded p-4">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Jour</th>
              <th className="border px-4 py-2 text-left">Début</th>
              <th className="border px-4 py-2 text-left">Fin</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id_horaire}>
                <td className="border px-4 py-2">
                  {new Date(s.jour).toLocaleDateString("fr-FR")}
                </td>
                <td className="border px-4 py-2">
                  {new Date(s.heure_debut).toLocaleTimeString("fr-FR")}
                </td>
                <td className="border px-4 py-2">
                  {new Date(s.heure_fin).toLocaleTimeString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
