"use client";

import React, { useEffect, useState } from "react";

interface Ressource {
  id_ressources: string;
  type: string;
  url: string;
  date_ajout: string;
}

export default function ResourcesPage() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRessources() {
      try {
        setLoading(true);
        const res = await fetch("/api/ressources");
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        setRessources(data.data);
      } catch (err: any) {
        console.error("Erreur fetch /api/ressources:", err);
        setError(
          err.message || "Erreur lors de la récupération des ressources"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRessources();
  }, []);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4">Liste des Ressources</h1>

        {ressources.length === 0 ? (
          <p>Aucune ressource trouvée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-left">URL</th>
                  <th className="border px-4 py-2 text-left">Date Ajout</th>
                  <th className="border px-4 py-2 text-left">Télécharger</th>
                </tr>
              </thead>
              <tbody>
                {ressources.map((r) => (
                  <tr key={r.id_ressources}>
                    <td className="border px-4 py-2">{r.type}</td>
                    <td className="border px-4 py-2">{r.url}</td>
                    <td className="border px-4 py-2">
                      {new Date(r.date_ajout).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="border px-4 py-2">
                      {/* Lien permettant de télécharger la ressource */}
                      <a
                        href={r.url}
                        download
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Télécharger
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
