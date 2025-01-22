"use client";
import { useState, useEffect } from "react";
import { useStudents, Student } from "./useStudents";

export interface Class {
  id: string;
  name: string;
  description: string;
  schedule: string;
  students?: Student[]; // Add students to the class
}

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useStudents();

  // Fetch all classes and map students
  const fetchClassesWithStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/classes");
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data: Class[] = await res.json();

      // Map students to their classes
      const classesWithStudents = data.map((classItem) => ({
        ...classItem,
        students: students.filter(
          (student) => student.id_classe === classItem.id
        ),
      }));

      setClasses(classesWithStudents);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!studentsLoading) {
      fetchClassesWithStudents();
    }
  }, [students, studentsLoading]);

  // Fetch a single class by ID and include students
  const getClass = async (id: string) => {
    setLoading(true);
    setError(null);
    setSelectedClass(null);
    try {
      const res = await fetch(`./api/classes/${id}`);
      if (!res.ok) throw new Error("Failed to fetch the class");
      const data: Class = await res.json();

      // Attach students to the selected class
      const classWithStudents = {
        ...data,
        students: students.filter((student) => student.id_classe === data.id),
      };

      setSelectedClass(classWithStudents);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Other CRUD operations remain unchanged
  const addClass = async (newClass: Partial<Class>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("./api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      });
      if (!res.ok) throw new Error("Failed to add class");
      fetchClassesWithStudents(); // Refresh classes
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, updatedClass: Partial<Class>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`./api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      if (!res.ok) throw new Error("Failed to update class");
      fetchClassesWithStudents(); // Refresh classes
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`./api/classes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete class");
      fetchClassesWithStudents(); // Refresh classes
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesWithStudents();
  }, []);

  return {
    classes,
    selectedClass,
    loading: loading || studentsLoading,
    error: error || studentsError,
    addClass,
    updateClass,
    deleteClass,
    getClass,
  };
}
