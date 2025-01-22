import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

interface Params {
  params: {
    formateurId: string;
    classe_id: string; // Correspond à `id_classe`
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (token.role !== Role.FORMATEUR) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    // Idéalement, on vérifie que le formateur a bien le droit d’accéder à cette classe
    // 1) On récupère la classe par son ID
    const classe = await prisma.classe.findUnique({
      where: { id_classe: params.classe_id },
      include: {
        Horaires: {
          include: {
            Programmer: true,
          },
        },
      },
    });

    if (!classe) {
      return NextResponse.json(
        { error: "Classe introuvable" },
        { status: 404 }
      );
    }

    // 2) Vérifier que la classe est liée au formateurId => via Horaires -> Programmer
    // On check si un "Programmer" a un "id_formateur" == params.formateurId
    // (le some() pour trouver au moins un lien)
    const foundLink = classe.Horaires.Programmer.some(
      (prog) => prog.id_formateur === params.formateurId
    );

    if (!foundLink) {
      return NextResponse.json(
        { error: "Classe non liée à ce formateur" },
        { status: 403 }
      );
    }

    // 3) Si tout est OK, on renvoie la classe
    return NextResponse.json(classe);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
