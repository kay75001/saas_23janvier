// progression de l'eleve
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


interface ProgressionData {
  // Définissez la structure des données de progression
  coursValides: number;
  totalCours: number;
  notesMoyenne: number;
  // etc.
}

export default function ProgressionPage() {
  const [progression, setProgression] = useState<ProgressionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    //Vérifier que c'est un étudiant
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "STUDENT") {
      router.push("/unauthorized");
      return;
    }
    fetchProgression();

    // fetch progression
    async function fetchProgression() {
      try {
        setLoading(true);
        // On suppose une API /api/progression?etudiantId=xxx
        const res = await fetch(
          `/api/etudiant/progression?etudiantId=${session?.user!.id}`
        );
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        setProgression(data.data);
      } catch (err: any) {
        console.error("Erreur fetch progression:", err);
        setError(
          err.message || "Erreur lors de la récupération de la progression"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProgression();
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }
  if (error) {
    return <p className="text-red-500">Erreur: {error}</p>;
  }
  if (loading) {
    return <p>Chargement des données de progression...</p>;
  }
  if (!progression) {
    return <p>Aucune donnée de progression disponible.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ma Progression</h1>
      <div className="bg-white shadow-md rounded p-4 space-y-2">
        <p>
          Cours validés: {progression.coursValides} / {progression.totalCours}
        </p>
        <p>Note moyenne: {progression.notesMoyenne}</p>
        {/* Affichez d’autres données si besoin */}
      </div>
    </div>
  );
}
