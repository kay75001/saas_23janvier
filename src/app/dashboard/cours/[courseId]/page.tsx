//Détail/édition d’une formation
"use client";

import React, { useEffect, useState } from "react";
import CourseForm from "@/components/forms/CourseForm";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id"); // id du cours à éditer

  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    // Exemple : fetch depuis l’API
    async function fetchCourse() {
      if (!courseId) return;
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      setCourseData(data); // { title, description, category, dateCreation, etc. }
    }
    fetchCourse();
  }, [courseId]);

  const handleSuccess = () => {
    // Après mise à jour réussie, retourner à la liste ou afficher un message
    console.log("Cours mis à jour !");
    router.push("/dashboard/courses");
  };

  if (!courseData) {
    return <p>Chargement des données...</p>;
  }

  return (
    <div className="p-6">
      <CourseForm />
    </div>
  );
}
