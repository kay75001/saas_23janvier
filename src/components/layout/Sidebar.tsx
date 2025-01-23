"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Par exemple, si c'est un formateur
  const formateurLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sessions", href: "/dashboard/sessions" },
    { label: "Etudiants", href: "/dashboard/etudiants" },
    { label: "Messages", href: "/dashboard/messages" },
    { label: "Paramètres", href: "/dashboard/settings" },
  ];

  // Pour un étudiant
  const etudiantLinks = [
    { label: "Accueil", href: "/student" },
    { label: "Progression", href: "/student/progression" },
    { label: "Messages", href: "/student/messages" },
    { label: "Paramètres", href: "/student/settings" },
  ];

  // If user is formateur => show formateurLinks, else studentLinks
  const links =
    session?.user?.role === "FORMATEUR" ? formateurLinks : etudiantLinks;

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="mt-8 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`block px-4 py-2 rounded transition ${
                active ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
