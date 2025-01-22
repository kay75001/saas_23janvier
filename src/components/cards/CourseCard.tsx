"use client";

import { FC } from "react";

interface CourseCardProps {
  title: string;
  description: string;
  dateCreation?: string;
  onClick?: () => void;
}

const CourseCard: FC<CourseCardProps> = ({
  title,
  description,
  dateCreation,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      {dateCreation && (
        <p className="text-sm text-gray-500 mb-4">
          Créé le : {new Date(dateCreation).toLocaleDateString("fr-FR")}
        </p>
      )}
      <button
        onClick={onClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Voir le cours
      </button>
    </div>
  );
};

export default CourseCard;
