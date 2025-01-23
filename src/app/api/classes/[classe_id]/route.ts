import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { classe_id: string } }
) {
  try {
    const { classe_id } = params;

    if (!classe_id) {
      return NextResponse.json(
        { success: false, error: "classe_id is missing" },
        { status: 400 }
      );
    }

    // Query the DB
    const classe = await prisma.classe.findUnique({
      where: { id_classe: classe_id },
      // include: { Horaires: true, ... } if needed
    });

    if (!classe) {
      return NextResponse.json(
        { success: false, error: "Classe introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: classe }, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/classes/[classe_id] :", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
