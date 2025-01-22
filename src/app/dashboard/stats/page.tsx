//  Pages pour afficher les statistiques
"use client";

import ChartCard from "@/components/charts/StatsChart";

export default function StatsPage() {
  const data = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    values: [12, 19, 3, 5, 2, 3],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistiques</h1>
      <ChartCard
        title="Progression Mensuelle"
        data={data}
        color="#10b981" // Couleur verte
      />
    </div>
  );
}
