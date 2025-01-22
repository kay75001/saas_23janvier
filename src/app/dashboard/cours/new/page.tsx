"use client";

import React from "react";
import CourseForm from "@/components/forms/CourseForm";

export default function NewCoursePage() {
  const handleSuccess = () => {
    // Exemple : redirection vers la liste des cours, ou message de succès
    console.log("Nouveau cours créé !");
  };

  return (
    <div className="p-6">
      <CourseForm />
    </div>
  );
}
