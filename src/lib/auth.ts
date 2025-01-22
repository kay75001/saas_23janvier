// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt"; // Utilisation de bcrypt pour la consistance

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { email, password } = credentials;

        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: { email },
          include: { formateur: true, etudiant: true },
        });

        if (!user) return null;

        // Comparer les mots de passe (assurez-vous que les mots de passe sont hashés)
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Déterminer le rôle de l'utilisateur
        let role: Role = user.role;
        if (user.formateur) role = Role.FORMATEUR;
        if (user.etudiant) role = Role.STUDENT;

        // Créer le nom complet en mappant 'nom' à 'name'
        const name = `${user.prenom} ${user.nom}`.trim(); // Assurez-vous que 'prenom' et 'nom' sont bien définis

        // Retourner l'utilisateur avec les propriétés requises par NextAuth.js
        return { id: user.id, name, nom: user.nom, email: user.email, role };
      },
    }),
    // Ajoutez d'autres providers si nécessaire
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nom = user.nom; // Inclure 'nom' dans le token si nécessaire
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.nom = token.nom as string; // Inclure 'nom' dans la session si nécessaire
        // 'name' est déjà géré par NextAuth.js
      }
      return session;
    },
  },
};
