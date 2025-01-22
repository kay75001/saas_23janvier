"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      <Link href="/">
        <h1 className="text-xl font-bold">Mon Application</h1>
      </Link>
      <div className="flex items-center space-x-4">
        {session?.user && (
          <>
            <span className="text-gray-600">
              Bonjour, {session.user.nom} ({session.user.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
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
