"use client";

import React, { useState } from "react";

export default function RessourceForm() {
  const [formData, setFormData] = useState({
    type: "",
    url: "",
    date_ajout: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ressources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Erreur: " + data.error);
      } else {
        alert("Ressource créée !");
        setFormData({ type: "", url: "", date_ajout: "" });
      }
    } catch (error) {
      console.error("Erreur POST /api/ressources:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 shadow-md rounded"
    >
      <h2 className="text-xl font-semibold">Ajouter une Ressource</h2>

      <div>
        <label htmlFor="type" className="block font-medium">
          Type
        </label>
        <input
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="url" className="block font-medium">
          URL
        </label>
        <input
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="date_ajout" className="block font-medium">
          Date d'ajout
        </label>
        <input
          id="date_ajout"
          name="date_ajout"
          type="date"
          value={formData.date_ajout}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enregistrer
      </button>
    </form>
  );
}
