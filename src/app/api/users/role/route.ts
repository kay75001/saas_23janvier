import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// Exemple : PATCH { userId: string, role: "STUDENT" | "FORMATEUR" }
export async function PATCH(req: NextRequest) {
  try {
    const { userId, role } = await req.json();

    // Validation simple du rôle
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
