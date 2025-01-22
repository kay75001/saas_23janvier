//Pages ou composant de messagerie (Notifications).

"use client";

import React, { useEffect, useState } from "react";

interface Message {
  id: string; // Dans le schéma: id
  message: string; // Le contenu du message
  type: string; // Type de notification/message
  dateNotification: string; // Date (en ISO string) => ex. 2023-10-01T08:00:00Z
  userId: string; // Lien vers l'utilisateur
  id_etudiant?: string; // Optionnel si c’est un message pour un étudiant
  id_formateur?: string; // Optionnel si c’est un message pour un formateur
  // Ajoutez d’autres champs si besoin
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        // On suppose qu'il existe une route GET /api/messages
        const res = await fetch("/api/messages");
        if (!res.ok) {
          throw new Error(`Erreur HTTP : ${res.status}`);
        }
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Erreur inconnue");
        }
        // data.data contient le tableau de messages
        setMessages(data.data);
      } catch (err: any) {
        console.error("Erreur fetch /api/messages :", err);
        setError(err.message || "Erreur lors de la récupération des messages");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Chargement des messages...</p>;
  }

  if (error) {
    return <p className="text-red-500">Erreur : {error}</p>;
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4">Mes Messages</h1>

        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Message</th>
                <th className="border px-4 py-2 text-left">Type</th>
                <th className="border px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td className="border px-4 py-2">{msg.message}</td>
                  <td className="border px-4 py-2">{msg.type}</td>
                  <td className="border px-4 py-2">
                    {new Date(msg.dateNotification).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
