import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Exemple si vous utilisez next-auth
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client"; // Récupère STUDENT, FORMATEUR, etc.
// PERMET AU FORMATEUR DE VOIS LA LISTE DES ETUDIANTS
export async function GET(req: NextRequest) {
  try {
    // 1) Récupération du token (selon votre implémentation Auth)
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // 2) Vérifier le rôle de l’utilisateur
    // On suppose que vous avez stocké le rôle dans le token, ex: token.role = 'FORMATEUR'
    if (token.role !== Role.FORMATEUR) {
      return NextResponse.json(
        { error: "Accès interdit : vous n’êtes pas un formateur" },
        { status: 403 }
      );
    }

    // 3) Requête Prisma pour récupérer la liste de tous les étudiants
    const etudiants = await prisma.etudiant.findMany({
      include: {
        user: true, // si vous voulez inclure les informations du User relié
        Programme: true,
        Classe: true,
      },
    });

    // 4) Renvoyer la liste
    return NextResponse.json(etudiants);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
