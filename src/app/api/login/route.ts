// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma" // Assurez-vous que Prisma est correctement initialisé
import bcrypt from "bcrypt"

interface LoginBody {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse the JSON body
    const { email, password } = (await request.json()) as LoginBody

    // 2. Vérifier l'utilisateur via Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "Identifiants invalides" }, { status: 401 })
    }

    // 3. Comparer les mots de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Identifiants invalides" }, { status: 401 })
    }

    // 4. Générer un JWT
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h", // validité du token
      }
    )

    // 5. Créer une réponse
    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })

    // 6. Définir le token dans un cookie HttpOnly
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // uniquement en HTTPS en production
      maxAge: 60 * 60, // 1 heure en secondes
      path: "/",        // cookie valide pour toutes les routes
      // sameSite: "strict", // optionnel : définir la politique sameSite
    })

    return response
  } catch (error) {
    console.error("POST /api/login error:", error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}
