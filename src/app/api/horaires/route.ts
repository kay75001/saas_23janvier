import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Exemple de requête PATCH:
 * {
 *   "formateurId": "clMyFormateurId",
 *   "horairesId": ["idHoraire1", "idHoraire2"]
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { formateurId, horairesId } = await req.json();

    const horairesArray = Array.isArray(horairesId) ? horairesId : [horairesId];
    const results = [];

    for (const hId of horairesArray) {
      const record = await prisma.programmer.create({
        data: {
          id_formateur: formateurId,
          horaires_id: hId,
        },
      });
      results.push(record);
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
