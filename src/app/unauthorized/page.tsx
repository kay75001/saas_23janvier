// app/unauthorized/page.tsx
"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Accès Refusé</h1>
      <p className="mb-6">
        Vous n'avez pas les droits nécessaires pour accéder à cette page.
      </p>
      <Link href="/">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retour à l'accueil
        </button>
      </Link>
    </div>
  );
}
