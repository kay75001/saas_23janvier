import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/ressources
 * Récupérer la liste de toutes les ressources
 */
export async function GET() {
  try {
    const ressources = await prisma.ressources.findMany({
      // Optionnel : vous pouvez inclure des relations si besoin
      // include: { ... },
    });

    return NextResponse.json(
      { success: true, data: ressources },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/ressources :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ressources
 * Créer une nouvelle ressource
 * Exemple de body JSON :
 * {
 *   "type": "PDF",
 *   "url": "/uploads/moncours.pdf",
 *   "date_ajout": "2023-10-01"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, url, date_ajout } = body;

    // Vérification minimaliste
    if (!type || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Champs obligatoires manquants (type, url)",
        },
        { status: 400 }
      );
    }

    // date_ajout peut être optionnel, sinon on le met à now()
    const parsedDate = date_ajout ? new Date(date_ajout) : new Date();

    const newResource = await prisma.ressources.create({
      data: {
        type,
        url,
        date_ajout: parsedDate,
      },
    });

    return NextResponse.json(
      { success: true, data: newResource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/ressources :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
