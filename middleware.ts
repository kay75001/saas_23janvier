// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      role: string;
    };

    
    // Vérifiez les permissions selon le chemin
    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard")) {
      if (decoded.role !== "FORMATEUR") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } else if (path.startsWith("/student")) {
      if (decoded.role !== "STUDENT") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Si tout est bon, continuez la requête
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware JWT error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Appliquer le middleware aux segments appropriés
export const config = {
  matcher: ["/dashboard/:path*", "/student/:path*"],
};
