// app/(dashboard)/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Accueil", path: "/dashboard" },
    { name: "Cours", path: "/dashboard/cours" },
    { name: "Étudiants", path: "/dashboard/etudiants" },
    { name: "Sessions", path: "/dashboard/sessions" },
    { name: "Statistiques", path: "/dashboard/statistiques" },
    { name: "Messages", path: "/dashboard/messages" },
    { name: "Paramètres", path: "/dashboard/parametres" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <nav className="mt-10">
        {menuItems.map((item) => (
          <Link href={item.path} key={item.name}>
            <a
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                pathname === item.path ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
