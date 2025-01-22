import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    horaire_id: string; // Correspond à id_horaire
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const horaire = await prisma.horaires.findUnique({
      where: { id_horaire: params.horaire_id },
      include: {
        Classe: true,
        Programmer: true,
      },
    });
    if (!horaire) {
      return NextResponse.json({ error: "Horaire not found" }, { status: 404 });
    }
    return NextResponse.json(horaire);
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
    const horaire = await prisma.horaires.update({
      where: { id_horaire: params.horaire_id },
      data,
    });
    return NextResponse.json(horaire);
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
    const horaire = await prisma.horaires.update({
      where: { id_horaire: params.horaire_id },
      data,
    });
    return NextResponse.json(horaire);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.horaires.delete({
      where: { id_horaire: params.horaire_id },
    });
    return NextResponse.json({ message: "Horaire deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
