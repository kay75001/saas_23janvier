import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//  AFFICHE LES INFORMATIONS DU FORMATEUR ET SES ACTIONS POSSIBLE SUR SON PROFIL

interface Params {
  params: {
    formateur_id: string; // Correspond à id_formateur
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const formateur = await prisma.formateur.findUnique({
      where: { id_formateur: params.formateur_id },
      include: {
        user: true,
        Programme: true,
        Notifications: true,
        Avoir: true,
        Disposer: true,
        Donner: true,
        Programmer: true,
      },
    });
    if (!formateur) {
      return NextResponse.json(
        { error: "Formateur not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(formateur);
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
    const formateur = await prisma.formateur.update({
      where: { id_formateur: params.formateur_id },
      data,
    });
    return NextResponse.json(formateur);
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
    const formateur = await prisma.formateur.update({
      where: { id_formateur: params.formateur_id },
      data,
    });
    return NextResponse.json(formateur);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.formateur.delete({
      where: { id_formateur: params.formateur_id },
    });
    return NextResponse.json({ message: "Formateur deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
