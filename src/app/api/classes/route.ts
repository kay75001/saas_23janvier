import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle POST: Create a Classe
export async function POST(req: NextRequest) {
  try {
    const { nom, description, id_horaire } = await req.json();

    console.log("data received: ", {
      nom,
      description,
      id_horaire,
    });
    // Validate id_horaire
    if (!id_horaire) {
      return NextResponse.json(
        { error: "id_horaire is required" },
        { status: 400 }
      );
    }

    const existingHoraires = await prisma.horaires.findUnique({
      where: { id_horaire },
    });

    // Log the value of id_horaire and the result of the query
    console.log("Provided id_horaire:", id_horaire);

    if (!existingHoraires) {
      console.log("Query result for id_horaire:", existingHoraires); // Should log null if not found
      return NextResponse.json(
        { error: "Invalid id_horaire provided", provided: id_horaire },
        { status: 400 }
      );
    }

    console.log("Valid id_horaire found:", existingHoraires);

    const classe = await prisma.classe.create({
      data: {
        nom,
        description,
        id_horaire,
      },
    });

    return NextResponse.json(classe, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create classe", details: error.message },
        { status: 500 }
      );
    }
  }
}

// Handle GET: Retrieve all or a single Classe
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const classe = await prisma.classe.findUnique({
        where: { id_classe: id },
        include: {
          Horaires: true, // Include related horaires
          Etudiant: true, // Include students in the class
        },
      });

      if (!classe) {
        return NextResponse.json(
          { error: "Classe not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(classe);
    }

    const classes = await prisma.classe.findMany({
      include: {
        Horaires: true,
        Etudiant: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to fetch classes", details: error.message },
        { status: 500 }
      );
    }
  }
}

// Handle PUT: Update a Classe
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Classe ID is required" },
      { status: 400 }
    );
  }

  try {
    const { nom, description, id_horaire } = await req.json();

    const updatedClasse = await prisma.classe.update({
      where: { id_classe: id },
      data: {
        nom,
        description,
        id_horaire,
      },
    });

    return NextResponse.json(updatedClasse);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update classe ", details: error },
      { status: 500 }
    );
  }
}

// Handle DELETE: Delete a Classe
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Classe ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.classe.delete({
      where: { id_classe: id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to delete classe", details: error },
        { status: 500 }
      );
    }
  }
}
