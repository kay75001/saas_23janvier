// page de tout les etudiants
"use client";

import React, { useEffect, useState } from "react";

interface Etudiant {
  id_etudiant: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  // Ajoutez d'autres champs de votre schéma si besoin
}

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEtudiants() {
      try {
        const res = await fetch("/api/etudiants"); // Adaptez l'URL si nécessaire
        if (!res.ok) {
          throw new Error(`Erreur HTTP : ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Une erreur est survenue.");
        }
        // data.data = tableau d'étudiants
        setEtudiants(data.data);
      } catch (err: any) {
        console.error("Erreur fetch /api/etudiants:", err);
        setError(err.message || "Erreur lors de la récupération des étudiants");
      } finally {
        setLoading(false);
      }
    }

    fetchEtudiants();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des étudiants</h1>
      {etudiants.length === 0 ? (
        <p>Aucun étudiant trouvé.</p>
      ) : (
        etudiants.map((etudiant) => (
          <div key={etudiant.id_etudiant} className="border p-3 mb-3 rounded">
            <h2 className="text-xl font-semibold">
              {etudiant.nom} {etudiant.prenom}
            </h2>
            {etudiant.email && <p>Email : {etudiant.email}</p>}
            {etudiant.telephone && <p>Téléphone : {etudiant.telephone}</p>}
          </div>
        ))
      )}
    </div>
  );
}
