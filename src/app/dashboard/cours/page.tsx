"use client";

import React, { useEffect, useState } from "react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) {
          setCourses(data.data);
        } else {
          console.error("Erreur:", data.error);
        }
      } catch (error) {
        console.error("Erreur fetch /api/courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des cours</h1>
      {courses.map((course) => (
        <div key={course.id_cours} className="border p-2 my-2">
          <h2 className="text-xl font-semibold">{course.titre}</h2>
          <p>{course.description}</p>
          <p className="text-sm text-gray-500">
            Créé le :{" "}
            {new Date(course.date_creation).toLocaleDateString("fr-FR")}
          </p>
        </div>
      ))}
    </div>
  );
}
