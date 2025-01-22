// app/layout.tsx
"use client"; // Assurez-vous que ce fichier est un composant client

import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
