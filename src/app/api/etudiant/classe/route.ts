import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Exemple de requête PATCH:
 * {
 *   "etudiantId": "clMyEtudiantId",
 *   "classeId": "clMyClasseId"
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { etudiantId, classeId } = await req.json();
    const updatedEtudiant = await prisma.etudiant.update({
      where: { id_etudiant: etudiantId },
      data: { id_classe: classeId },
    });
    return NextResponse.json(updatedEtudiant);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
