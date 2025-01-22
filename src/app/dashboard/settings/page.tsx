//Page pour les paramètres du compte formateur
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormateurSettings {
  telephone: string;
  status_actuel: string;
  // Ajoutez d'autres champs paramétrables
}

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState<FormateurSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Vérifier formateur
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "FORMATEUR") {
      router.push("/unauthorized");
      return;
    }

    async function fetchSettings() {
      try {
        setLoading(true);
        // API ex: /api/formateurs/settings?formateurId=xxx
        const res = await fetch(`/api/formateurs/settings?formateurId=${session?.user.id}`);
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        setSettings(data.data);
      } catch (err: any) {
        console.error("Erreur fetch formateur settings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch(`/api/formateurs/settings?formateurId=${session?.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Erreur: " + data.error);
      } else {
        alert("Paramètres mis à jour");
      }
    } catch (err: any) {
      console.error("Erreur update formateur settings:", err);
      alert("Erreur update");
    }
  }

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }
  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }
  if (loading) {
    return <p>Chargement des paramètres...</p>;
  }
  if (!settings) {
    return <p>Impossible de charger les paramètres.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Paramètres Formateur</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow-md rounded">
        <div>
          <label htmlFor="telephone" className="block font-medium">
            Téléphone
          </label>
          <input
            type="text"
            id="telephone"
            value={settings.telephone}
            onChange={(e) => setSettings({ ...settings, telephone: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <div>
          <label htmlFor="status_actuel" className="block font-medium">
            Status Actuel
          </label>
          <input
            type="text"
            id="status_actuel"
            value={settings.status_actuel}
            onChange={(e) => setSettings({ ...settings, status_actuel: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
