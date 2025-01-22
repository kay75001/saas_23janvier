// page d'un etudiant
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  nom: string;
  prenom: string;
  email: string;
  // autres champs si besoin
}

interface Etudiant {
  id_etudiant: string;
  telephone: string;
  user?: User;
  // d'autres champs si nécessaire (classe, programme, etc.)
}

interface EtudiantDetailsPageProps {
  params: {
    etudiantId: string; // segment dynamique
  };
}

export default function EtudiantDetailsPage({
  params,
}: EtudiantDetailsPageProps) {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchEtudiant() {
      try {
        setLoading(true);
        const res = await fetch(`/api/etudiants/${params.etudiantId}`);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        setEtudiant(data.data);
      } catch (err: any) {
        console.error("Erreur fetch /api/etudiants/[etudiantId]:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.etudiantId) {
      fetchEtudiant();
    } else {
      setError("ID de l'étudiant non fourni.");
      setLoading(false);
    }
  }, [params.etudiantId]);

  if (loading) {
    return <p>Chargement des informations de l'étudiant...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  if (!etudiant) {
    return <p>Aucun étudiant trouvé.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Détails de l'étudiant</h1>
      <div className="bg-white shadow-md rounded p-4">
        <p className="mb-2">
          <strong>ID Étudiant:</strong> {etudiant.id_etudiant}
        </p>
        {etudiant.user && (
          <>
            <p className="mb-2">
              <strong>Nom:</strong> {etudiant.user.nom}
            </p>
            <p className="mb-2">
              <strong>Prénom:</strong> {etudiant.user.prenom}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {etudiant.user.email}
            </p>
          </>
        )}
        <p className="mb-2">
          <strong>Téléphone:</strong> {etudiant.telephone}
        </p>
        {/* Afficher d'autres champs si besoin (classe, programme, etc.) */}
      </div>
    </div>
  );
}
