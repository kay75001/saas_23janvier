import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

/**
 * Exemple de requête POST:
 * {
 *   "nom": "Dupont",
 *   "prenom": "Paul",
 *   "email": "paul.dupont@example.com",
 *   "password": "monSuperMotDePasse",
 *   "telephone": "0600000000",
 *   "status_actuel": "Disponible",
 *   "prochain_cours": "Java avancé",
 *   ...
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // 1) Récupération des données
    const {
      nom,
      prenom,
      email,
      password,
      telephone,
      status_actuel,
      prochain_cours,...rest
      // ... autres champs nécessaires
    } = await req.json();

    console.log("Data received:", {
      nom,
      prenom,
      email,
      password,
      telephone,
      status_actuel,
      prochain_cours,...rest
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
  




    // 2) Hasher le mot de passe (optionnel, recommandé)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Créer le User avec role = FORMATEUR
    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: Role.FORMATEUR, // <-- ICI
      },
    });

    // 4) Créer le Formateur associé
    const formateur = await prisma.formateur.create({
      data: {
        userId: user.id, // liaison avec le user
        telephone: telephone,
        status_actuel: status_actuel,
        prochain_cours: prochain_cours,
        // fin_cours, id_programme, etc. si nécessaire
      },
    });

    return NextResponse.json({
      message: "Inscription Formateur réussie",
      user,
      formateur,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
