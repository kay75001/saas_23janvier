// app/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client"; // Import the Role enum from Prisma client

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Attendre que la session soit chargée
    if (session) {
      // Rediriger en fonction du rôle
      if (session.user.role === Role.FORMATEUR) {
        router.push("/dashboard");
      } else if (session.user.role === Role.STUDENT) {
        router.push("/student");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
       <h1 className="text-4xl font-bold mb-4">
        Bienvenue sur Notre Plateforme de Formation
      </h1>
      <p className="mb-6 text-lg text-center max-w-md">
        Gérez vos cours, suivez vos apprenants et optimisez votre enseignement
        avec notre interface intuitive.
      </p>
      <div className="space-x-4">
        <Link href="/auth/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Se Connecter
          </button>
        </Link>
        <Link href="/auth/register">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            S'inscrire
          </button>
        </Link>
      </div> 




      </div>
  );
}
