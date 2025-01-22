"use client";

import React, { useState } from "react";

export default function CourseForm() {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "",
    fichierAssocies: "",
    date_creation: "",
    horaires: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.success) {
        alert("Erreur: " + (result.error || "Inconnue"));
      } else {
        alert("Cours créé avec succès!");
        // reset
        setFormData({
          titre: "",
          description: "",
          categorie: "",
          fichierAssocies: "",
          date_creation: "",
          horaires: "",
        });
      }
    } catch (error) {
      console.error("Erreur requête POST /api/courses:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titre">Titre:</label>
        <input
          id="titre"
          name="titre"
          type="text"
          value={formData.titre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="categorie">Catégorie:</label>
        <input
          id="categorie"
          name="categorie"
          type="text"
          value={formData.categorie}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="fichierAssocies">Fichier Associé:</label>
        <input
          id="fichierAssocies"
          name="fichierAssocies"
          type="text"
          value={formData.fichierAssocies}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="date_creation">Date de création:</label>
        <input
          id="date_creation"
          name="date_creation"
          type="date"
          value={formData.date_creation}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="horaires">Horaires:</label>
        <input
          id="horaires"
          name="horaires"
          type="datetime-local"
          value={formData.horaires}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  );
}
