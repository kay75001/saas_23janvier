import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/messages
 * Récupère la liste des messages (Notifications)
 */
export async function GET(req: NextRequest) {
  try {
    // On récupère toutes les notifications
    const messages = await prisma.notifications.findMany({
      // Optionnel : inclure la relation user, etudiant, formateur, etc.
      // include: { user: true, Etudiant: true, Formateur: true },
    });

    return NextResponse.json(
      { success: true, data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/messages :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
