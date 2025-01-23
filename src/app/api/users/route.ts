// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"; // Importation de bcrypt



// Handle GET: Retrieve User with Etudiant or Formateur details
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          etudiant: true,
          formateur: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    }

    const users = await prisma.user.findMany({
      include: {
        etudiant: true,
        formateur: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error },
      { status: 500 }
    );
  }
}

// Handle PUT: Update User, Etudiant, or Formateur
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { role, password, ...data } = await req.json();

    // Préparer les données à mettre à jour
    let updateData: any = { ...data };

    // Si le mot de passe est fourni, le hacher
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    if (role === "STUDENT") {
      const etudiant = await prisma.etudiant.update({
        where: { userId: id },
        data,
      });
      return NextResponse.json({ user, etudiant });
    } else if (role === "FORMATEUR") {
      const formateur = await prisma.formateur.update({
        where: { userId: id },
        data,
      });
      return NextResponse.json({ user, formateur });
    } else {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT or FORMATEUR." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error },
      { status: 500 }
    );
  }
}

// Handle DELETE: Delete User and associated Etudiant or Formateur
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Supprimer les associations Etudiant ou Formateur avant de supprimer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        etudiant: true,
        formateur: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.etudiant) {
      await prisma.etudiant.delete({
        where: { userId: id },
      });
    }

    if (user.formateur) {
      await prisma.formateur.delete({
        where: { userId: id },
      });
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 } // 204 No Content ne peut pas avoir de corps
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error },
      { status: 500 }
    );
  }
}
