// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Rediriger en fonction du rôle de l'utilisateur
        if (data.user.role === "FORMATEUR") {
          router.push("/dashboard");
        } else if (data.user.role === "STUDENT") {
          router.push("/student");
        }
      } else {
        setError(data.error || "Erreur lors de la connexion");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      setError("Erreur lors de la connexion");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-80">
        <div>
          <label>Email :</label>
          <br />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="mb-4 p-2 border rounded w-full"
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mb-4 p-2 border rounded  w-full"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700"
        >
          Se connecter
        </button>
      </form>
      <p className="mt-4">
        Pas encore inscrit ?{" "}
        <Link href="/auth/register" className="text-green-600">
          S'inscrire
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
