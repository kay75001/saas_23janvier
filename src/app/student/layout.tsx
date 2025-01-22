// Layout élève (menu, header)

import { ReactNode } from "react";
import "../globals.css";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar élève */}
      <aside className="w-64 bg-gray-100">
        <nav>
          <ul>
            <li>
              <a href="/student">Dashboard</a>
            </li>
            <li>
              <a href="/student/courses">Mes formations</a>
            </li>
            <li>
              <a href="/student/progression">Ma progression</a>
            </li>
            <li>
              <a href="/student/messages">Mes messages</a>
            </li>
            <li>
              <a href="/student/settings">Paramètres</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
