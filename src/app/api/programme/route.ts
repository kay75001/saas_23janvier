import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const programmes = await prisma.programme.findMany({
      include: {
        Etudiant: true,
        Formateur: true,
      },
    });

    if (programmes.length === 0) {
      return NextResponse.json(
        { error: "No programmes found" },
        { status: 404 }
      );
    }

    return NextResponse.json(programmes);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
