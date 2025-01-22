import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Exemple de requête PATCH:
 * {
 *   "formateurId": "clMyFormateurId",
 *   "programmeId": "clMyProgrammeId"
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { formateurId, programmeId } = await req.json();
    // On met à jour le champ `id_programme` dans Formateur
    const updatedFormateur = await prisma.formateur.update({
      where: { id_formateur: formateurId },
      data: {
        id_programme: programmeId,
      },
    });
    return NextResponse.json(updatedFormateur);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
