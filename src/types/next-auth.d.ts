// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nom: string;
      email: string;
      role: Role;
      // Ajoutez d'autres propriétés si nécessaire
    };
  }

  interface User {
    id: string;
    nom: string;
    email: string;
    role: Role;
    // Ajoutez d'autres propriétés si nécessaire
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    // Ajoutez d'autres propriétés si nécessaire
  }
}

export type Role = "FORMATEUR" | "STUDENT";
