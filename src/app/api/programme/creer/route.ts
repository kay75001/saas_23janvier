import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Exemple de requête POST:
 * {
 *   "description": "Programme 2025",
 *   "duree": "2025-12-31T23:59:59.000Z",
 *   "debut": "2025-01-01T08:00:00.000Z",
 *   "fin": "Avril 2025",
 *   "vacances": "2025-03-15T00:00:00.000Z"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { description, duree, debut, fin, vacances } = await req.json();

    const programme = await prisma.programme.create({
      data: {
        description,
        duree: new Date(duree),
        debut: new Date(debut),
        fin,
        vacances: new Date(vacances),
      },
    });

    return NextResponse.json(programme);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
