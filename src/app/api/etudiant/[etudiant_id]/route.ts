import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    etudiant_id: string; // Correspond à id_etudiant
    id: string; // Correspond à l'id de l'user
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const etudiant = await prisma.etudiant.findUnique({
      where: { id_etudiant: params.etudiant_id },
      include: {
        user: true,
        Classe: true,
        Exclus: true,
        Programme: true,
        Notifications: true,
        DetailsEtudiant: true,
        Apprendre: true,
        Consulter: true,
      },
    });
    if (!etudiant) {
      return NextResponse.json(
        { error: "Etudiant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(etudiant);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();
    const etudiant = await prisma.etudiant.update({
      where: { id_etudiant: params.etudiant_id },
      data,
    });
    return NextResponse.json(etudiant);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();
    const etudiant = await prisma.etudiant.update({
      where: { id_etudiant: params.etudiant_id },
      data,
    });
    return NextResponse.json(etudiant);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// FONCTION QUI EFFACE DIRECTEMENT L'UTILISATEUR AU LIEU DE L'ELEMENT PAR SON ROLE
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Etudiant deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
