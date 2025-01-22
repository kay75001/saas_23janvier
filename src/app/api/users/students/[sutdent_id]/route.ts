// POUR METTRE A JOUR UN ETUDIANT
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { id, nom, prenom, email, password } = await req.json();

    // Validate input
    if (!id || !nom || !prenom || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        nom,
        prenom,
        email,
        password: password ? password : undefined, // Only update password if provided
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error },
      { status: 500 }
    );
  }
}
