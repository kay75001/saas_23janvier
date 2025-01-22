// app/(dashboard)/messages/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MessagesFormateurPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      // session est null => pas connecté
      router.push("/login");
      return;
    }
    if (session.user.role !== "FORMATEUR") {
      router.push("/unauthorized");
      return;
    }

    // On peut maintenant appeler la fonction de fetch
    fetchMessagesForFormateur();
  }, [status, session, router]);

  async function fetchMessagesForFormateur() {
    try {
      // Check if session exists before accessing user.id
      if (!session || !session.user) {
        throw new Error("Session not available");
      }

      setLoading(true);
      const res = await fetch(`/api/messages?formateurId=${session.user.id}`);
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Erreur inconnue");
      }
      setMessages(data.data);
    } catch (err: any) {
      console.error("Erreur fetch /api/messages:", err);
      setError(err.message || "Erreur lors de la récupération des messages");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <p>Chargement de la session...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  // Rendu final (table, etc.)
  return (
    <div>
      {/* ... */}
      {loading ? (
        <p>Chargement des messages...</p>
      ) : messages.length === 0 ? (
        <p>Aucun message</p>
      ) : (
        // Affichage des messages
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>{msg.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
