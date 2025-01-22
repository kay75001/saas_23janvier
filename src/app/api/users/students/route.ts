// POUR RETROUVER TOUT LES ETUDIANTS OU UN SEUL

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle GET: Retrieve all or a single Etudiant
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const etudiant = await prisma.etudiant.findUnique({
        where: { id_etudiant: id },
        include: {
          Exclus: true, // Include exclusion data
          Programme: true, // Include programme data
          Classe: true, // Include class data
        },
      });

      if (!etudiant) {
        return NextResponse.json(
          { error: "Etudiant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(etudiant);
    }

    const etudiants = await prisma.etudiant.findMany({
      include: {
        Exclus: true,
        Programme: true,
        Classe: true,
      },
    });

    return NextResponse.json(etudiants);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch etudiants", details: error },
      { status: 500 }
    );
  }
}

// Handle PUT: Update an Etudiant
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Etudiant ID is required" },
      { status: 400 }
    );
  }

  try {
    const {
      //email,
      telephone,
      id_exclusion,
      id_programme,
      id_classe,
    } = await req.json();

    const updatedEtudiant = await prisma.etudiant.update({
      where: { id_etudiant: id },
      data: {
        //email,
        telephone,
        id_exclusion,
        id_programme,
        id_classe,
      },
    });

    return NextResponse.json(updatedEtudiant);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update etudiant", details: error },
      { status: 500 }
    );
  }
}

// Handle PATCH: Partially update an Etudiant
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Etudiant ID is required" },
      { status: 400 }
    );
  }

  try {
    const patchData = await req.json();

    // Validate foreign keys for any provided IDs
    if (patchData.id_exclusion) {
      const exclusionExists = await prisma.exclus.findUnique({
        where: { id_exclusion: patchData.id_exclusion },
      });
      if (!exclusionExists) {
        return NextResponse.json(
          { error: "Invalid id_exclusion: Record not found." },
          { status: 400 }
        );
      }
    }

    if (patchData.id_programme) {
      const programmeExists = await prisma.programme.findUnique({
        where: { id_programme: patchData.id_programme },
      });
      if (!programmeExists) {
        return NextResponse.json(
          { error: "Invalid id_programme: Record not found." },
          { status: 400 }
        );
      }
    }

    if (patchData.id_classe) {
      const classeExists = await prisma.classe.findUnique({
        where: { id_classe: patchData.id_classe },
      });
      if (!classeExists) {
        return NextResponse.json(
          { error: "Invalid id_classe: Record not found." },
          { status: 400 }
        );
      }
    }

    const updatedEtudiant = await prisma.etudiant.update({
      where: { id_etudiant: id },
      data: patchData,
    });

    return NextResponse.json(updatedEtudiant);
  } catch (error) {
    console.error("Error updating etudiant:", error);
    return NextResponse.json(
      { error: "Failed to update etudiant", details: error },
      { status: 500 }
    );
  }
}

// Handle DELETE: Delete an Etudiant
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Etudiant ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.etudiant.delete({
      where: { id_etudiant: id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete etudiant", details: error },
      { status: 500 }
    );
  }
}
