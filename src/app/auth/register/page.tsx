// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classe, setClasse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Appel à votre API d'inscription
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        password,
        role: "STUDENT",
        classe,
        telephone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription");
    } else {
      // Rediriger vers la page de connexion ou directement connecter
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-80">
        <label htmlFor="nom">Nom :</label>
        <input
          id="nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mb-4 p-2 border rounded"
        />

        <label htmlFor="prenom">Prénom :</label>
        <input
          id="prenom"
          type="text"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="mb-4 p-2 border rounded"
        />

        <label htmlFor="email">Email :</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 p-2 border rounded"
        />

        <label htmlFor="password">Mot de passe :</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 p-2 border rounded"
        />

        <label htmlFor="classe">Classe :</label>
        <select
          id="classe"
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
          required
          className="mb-4 p-2 border rounded"
        >
          <option value="">Sélectionnez une classe</option>
          <option value="dwwm">DWWM</option>
          <option value="cda">CDA</option>
        </select>

        <label htmlFor="telephone">Téléphone :</label>
        <input
          id="telephone"
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
          className="mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          S'inscrire
        </button>
      </form>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <p className="mt-4">
        Déjà un compte ?{" "}
        <Link href="/auth/login" className="text-blue-600">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
