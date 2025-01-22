// app/(dashboard)/components/Header.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <div>
        <Link href="/dashboard">
          <h1 className="text-xl font-bold">Dashboard Formateur</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {session && (
          <>
            <span className="text-gray-700">Bonjour, {session.user.nom}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}
