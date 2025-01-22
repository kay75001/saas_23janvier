import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Exemple de requête PATCH:
 * {
 *   "etudiantId": "clMyEtudiantId",
 *   "action": "EXCLURE" | "REACTIVER",
 *   "motif": "Optionnel pour l'exclusion",
 *   "description": "Optionnel"
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { etudiantId, action, motif, description } = await req.json();

    if (action === "EXCLURE") {
      // 1) Créer l'exclusion
      const newExclusion = await prisma.exclus.create({
        data: {
          motif,
          description,
          date_exclusion: new Date(),
          // Relations multiples : si vous souhaitez lier l’exclusion à l’étudiant
          // de façon multiple, ajustez selon votre schéma.
        },
      });
      // 2) Lier l'exclusion à l'étudiant
      const updatedEtudiant = await prisma.etudiant.update({
        where: { id_etudiant: etudiantId },
        data: {
          id_exclusion: newExclusion.id_exclusion,
        },
      });
      return NextResponse.json(updatedEtudiant);
    } else if (action === "REACTIVER") {
      const updatedEtudiant = await prisma.etudiant.update({
        where: { id_etudiant: etudiantId },
        data: { id_exclusion: null },
      });
      return NextResponse.json(updatedEtudiant);
    } else {
      return NextResponse.json(
        { error: "Action non reconnue" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
