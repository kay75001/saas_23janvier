import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/courses
 * Récupérer la liste de tous les cours
 */
export async function GET() {
  try {
    const courses = await prisma.cours.findMany({
      // Optionnel : vous pouvez inclure des relations comme Donner, Repartir, etc.
      // include: { Donner: true, Repartir: true },
    });

    return NextResponse.json({ success: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/courses :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * Créer un nouveau cours
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      titre,
      description,
      categorie,
      fichierAssocies,
      date_creation,
      horaires,
    } = body;

    // Vérification des champs obligatoires
    if (!titre || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Champs obligatoires manquants (titre, description)",
        },
        { status: 400 }
      );
    }

    // Création du nouveau cours
    const newCourse = await prisma.cours.create({
      data: {
        titre,
        description,
        categorie: categorie || "",
        fichierAssocies: fichierAssocies || "",
        date_creation: date_creation ? new Date(date_creation) : new Date(),
        horaires: horaires ? new Date(horaires) : new Date(), // Ajustez si besoin
        // Si vous souhaitez gérer d'autres relations comme Donner, Repartir, etc., adaptez ici
      },
    });

    return NextResponse.json(
      { success: true, data: newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/courses :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
