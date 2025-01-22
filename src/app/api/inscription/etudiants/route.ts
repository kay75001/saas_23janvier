import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

/**
 * Exemple de requête POST:
 * {
 *   "nom": "Dupont",
 *   "prenom": "Jean",
 *   "email": "jean.dupont@example.com",
 *   "password": "monSuperMotDePasse",
 *   "telephone": "0600000000"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { nom, prenom, email, password, telephone, ...rest } =
      await req.json();

    console.log("Data received before insertion:", {
      nom,
      prenom,
      email,
      password,
      Role,
      telephone,
      ...rest,
    });

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

    // 1) Créer le User avec role = STUDENT
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: Role.STUDENT,
      },
    });
    
    console.log(user);

    const programmeExists = await prisma.programme.findUnique({
      where: { id_programme: rest.id_programme },
    });

    if (!programmeExists) {
      throw new Error(`Programme with id ${rest.id_programme} does not exist`);
    }

    const classeExists = await prisma.classe.findUnique({
      where: { id_classe: rest.id_classe },
    });

    if (!classeExists) {
      throw new Error(`Classe with id ${rest.id_classe} does not exist`);
    }

    // 2) Créer l'Etudiant associé

    const etudiant = await prisma.etudiant.create({
      data: {
        userId: user.id,
        telephone,
        ...rest,
      },
    });

    console.log("Data received after insertion:", {
      nom,
      prenom,
      email,
      password,
      Role,
      telephone,
      ...rest,
    });

    return NextResponse.json({
      message: "Inscription réussie",
      user,
      etudiant,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
