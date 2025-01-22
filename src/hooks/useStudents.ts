"use client";
import { useState, useEffect } from "react";

export interface Student {
  id_etudiant: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  id_classe: string;
  id_exclusion: string;
  id_programme: string;
  profilePicture?: string;

}



export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      //const data: Student[] = await res.json();
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a new student
  const addStudent = async (newStudent: Partial<Student>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (!res.ok) throw new Error("Failed to add student");
      fetchStudents(); // Refresh students
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update a student
  const updateStudent = async (
    id: string,
    updatedStudent: Partial<Student>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      if (!res.ok) throw new Error("Failed to update student");
      fetchStudents(); // Refresh students
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, error, addStudent, updateStudent };
}
