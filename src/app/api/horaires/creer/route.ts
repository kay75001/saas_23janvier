import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Exemple de requête POST:
 * {
 *   "jour": "2025-01-20T00:00:00.000Z",
 *   "heure_debut": "2025-01-20T09:00:00.000Z",
 *   "heure_fin": "2025-01-20T12:00:00.000Z"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { jour, heure_debut, heure_fin } = await req.json();

    const newHoraire = await prisma.horaires.create({
      data: {
        jour: new Date(jour),
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
      },
    });

    return NextResponse.json(newHoraire);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
