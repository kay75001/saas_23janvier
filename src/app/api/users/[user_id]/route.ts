import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// AVOIR UN UTILISATEUR EN PARTICULIER ET LES ACTIONS SUR SON COMPTE

interface Params {
  params: {
    user_id: string;
  };
}

// Récupération d’un utilisateur par son ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.user_id },
      include: {
        formateur: true,
        etudiant: true,
        notifications: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Mise à jour complète d’un utilisateur
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();
    const user = await prisma.user.update({
      where: { id: params.user_id },
      data, // Assurez-vous de filtrer/valider data
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// Mise à jour partielle d’un utilisateur
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();
    const user = await prisma.user.update({
      where: { id: params.user_id },
      data, // Mise à jour partielle
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// Suppression d’un utilisateur
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.user.delete({
      where: { id: params.user_id },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
