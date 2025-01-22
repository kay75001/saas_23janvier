-- DropForeignKey
ALTER TABLE "Etudiant" DROP CONSTRAINT "Etudiant_id_classe_fkey";

-- DropForeignKey
ALTER TABLE "Etudiant" DROP CONSTRAINT "Etudiant_id_programme_fkey";

-- AlterTable
ALTER TABLE "Etudiant" ALTER COLUMN "id_programme" DROP NOT NULL,
ALTER COLUMN "id_classe" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_id_classe_fkey" FOREIGN KEY ("id_classe") REFERENCES "Classe"("id_classe") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_id_programme_fkey" FOREIGN KEY ("id_programme") REFERENCES "Programme"("id_programme") ON DELETE SET NULL ON UPDATE CASCADE;
