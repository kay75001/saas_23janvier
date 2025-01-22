/*
  Warnings:

  - You are about to drop the column `email` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Formateur` table. All the data in the column will be lost.
  - You are about to drop the column `mot_de_passe` on the `Formateur` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Formateur` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Formateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Etudiant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Formateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Etudiant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Formateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'FORMATEUR', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_id_etudiant_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_id_formateur_fkey";

-- AlterTable
ALTER TABLE "Etudiant" DROP COLUMN "email",
DROP COLUMN "nom",
DROP COLUMN "prenom",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Formateur" DROP COLUMN "email",
DROP COLUMN "mot_de_passe",
DROP COLUMN "nom",
DROP COLUMN "prenom",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id_etudiant" DROP NOT NULL,
ALTER COLUMN "id_formateur" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_userId_key" ON "Etudiant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Formateur_userId_key" ON "Formateur"("userId");

-- AddForeignKey
ALTER TABLE "Formateur" ADD CONSTRAINT "Formateur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_id_formateur_fkey" FOREIGN KEY ("id_formateur") REFERENCES "Formateur"("id_formateur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
