import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/etudiants
 * Récupère la liste de tous les étudiants
 */
export async function GET(req: NextRequest) {
  try {
    const etudiants = await prisma.etudiant.findMany({
      //Optionnel: inclure la relation "user" pour avoir nom, prenom, email
      include: { user: true, Classe: true },
    });

    //  on renvoie les champs d'Etudiant
    return NextResponse.json(
      { success: true, data: etudiants },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/etudiants :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
