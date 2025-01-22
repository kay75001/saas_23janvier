import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: {
    programme_id: string; // Correspond à id_programme
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const programme = await prisma.programme.findUnique({
      where: { id_programme: params.programme_id },
      include: {
        Etudiant: true,
        Formateur: true,
      },
    });
    if (!programme) {
      return NextResponse.json(
        { error: "Programme not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(programme);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();
    const programme = await prisma.programme.update({
      where: { id_programme: params.programme_id },
      data,
    });
    return NextResponse.json(programme);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const data = await req.json();
    const programme = await prisma.programme.update({
      where: { id_programme: params.programme_id },
      data,
    });
    return NextResponse.json(programme);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await prisma.programme.delete({
      where: { id_programme: params.programme_id },
    });
    return NextResponse.json({ message: "Programme deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
