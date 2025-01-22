import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

//a verfier le lien de l'id avec celui de l'interface !!!!!!!

const prisma = new PrismaClient();

interface Params {
  params: {
    etudiantId: string;
  };
}
/**
 * GET /api/etudiant/progression?etudiantId=xxx
 * Exemple:
 * Returns the "progression" for a given student, such as:
 * {
 *   coursValides: number,
 *   totalCours: number,
 *   notesMoyenne: number,
 * }
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // 1. Parse query params from the URL
    const { searchParams } = new URL(req.url);
    const etudiantId = searchParams.get("etudiantId");

    if (!etudiantId) {
      return NextResponse.json(
        { success: false, error: "Param 'etudiantId' is missing" },
        { status: 400 }
      );
    }

    // 2. Find the Etudiant in the DB (or compute progression from other relations)
    // Example: we retrieve some placeholder data, or you might:
    // - Count how many courses are completed
    // - Sum or average some "note" fields
    // etc.
    // For demonstration, we’ll just do a minimal "check" that the student exists
    const etudiant = await prisma.etudiant.findUnique({
      where: { id_etudiant: params.etudiantId },
      // If needed, include: { Apprendre: true, ... } to gather info
    });

    if (!etudiant) {
      return NextResponse.json(
        { success: false, error: "Étudiant introuvable" },
        { status: 404 }
      );
    }

    // 3. Here you'd do your logic to compute progression.
    // We'll return a placeholder for demonstration:
    const progression = {
      coursValides: 5,
      totalCours: 10,
      notesMoyenne: 14.5, // e.g. out of 20
      // Add more fields if needed
    };

    // 4. Return success + data
    return NextResponse.json(
      { success: true, data: progression },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/etudiant/progression :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
