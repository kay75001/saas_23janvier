// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"; // Importation de bcrypt

// Handle POST: Create User with Etudiant or Formateur data
 export async function POST(req: NextRequest) {
  /*
  try {
    const { nom, prenom, email, password, role, telephone, ...rest } =
      await req.json();

    console.log("Data received:", {
      nom,
      prenom,
      email,
      password,
      role,
      telephone,
      ...rest,
    });

    // Validate role
    if (!["STUDENT", "FORMATEUR"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT or FORMATEUR." },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // 10 est le nombre de salt rounds

    // Create the user avec le mot de passe haché
    const user = await prisma.user.create({
      data: {
        nom,
        prenom: prenom,
        email,
        password: hashedPassword, // Stocker le mot de passe haché
        role,
      },
      
    });

    // Create either Etudiant or Formateur
    if (role === "STUDENT") {
      const etudiant = await prisma.etudiant.create({
        data: {
          userId: user.id,
          telephone,
          ...rest, // Gère id_exclusion, id_programme, id_classe
        },
      });

      return NextResponse.json({ user, etudiant }, { status: 201 });
    } else if (role === "FORMATEUR") {
      const formateur = await prisma.formateur.create({
        data: {
          userId: user.id,
          telephone,
          ...rest, // Gère id_programme, prochain_cours, etc.
        },
      });

      return NextResponse.json({ user, formateur }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error },
      { status: 500 }
    );
  }
    */
}

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
