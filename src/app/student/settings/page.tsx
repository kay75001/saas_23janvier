// Page pour les paramètres eleve
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface StudentSettings {
  telephone: string;
  // Ajouter d'autres champs paramétrables (ex. mot de passe, etc.)
}

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState<StudentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Vérifier que c'est un étudiant
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "STUDENT") {
      router.push("/unauthorized");
      return;
    }

  // 3. Now we know session is definitely not null and user is STUDENT => fetch data
  fetchSettings();




    // fetch current settings
    async function fetchSettings() {
      try {
        setLoading(true);
        // Exemple: /api/students/settings?etudiantId=xxx
        const res = await fetch(
          `/api/students/settings?etudiantId=${session!.user!.id}`
        );
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        setSettings(data.data);
      } catch (err: any) {
        console.error("Erreur fetch settings:", err);
        setError(err.message || "Erreur récupération settings");
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
      // Exemple POST ou PATCH
      const res = await fetch(
        `/api/students/settings?etudiantId=${session?.user.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert("Erreur: " + data.error);
      } else {
        alert("Paramètres mis à jour");
      }
    } catch (err: any) {
      console.error("Erreur update settings:", err);
      alert("Erreur update settings");
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
      <h1 className="text-2xl font-bold mb-4">Paramètres Étudiant</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 shadow-md rounded"
      >
        <div>
          <label htmlFor="telephone" className="block font-medium">
            Téléphone
          </label>
          <input
            type="text"
            id="telephone"
            value={settings.telephone}
            onChange={(e) =>
              setSettings({ ...settings, telephone: e.target.value })
            }
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        {/* Ajouter d'autres champs (mot de passe, etc.) */}

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
