-- CreateTable
CREATE TABLE "Ressources" (
    "id_ressources" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ressources_pkey" PRIMARY KEY ("id_ressources")
);

-- CreateTable
CREATE TABLE "Horaires" (
    "id_horaire" TEXT NOT NULL,
    "jour" TIMESTAMP(3) NOT NULL,
    "heure_debut" TIMESTAMP(3) NOT NULL,
    "heure_fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horaires_pkey" PRIMARY KEY ("id_horaire")
);

-- CreateTable
CREATE TABLE "DetailsClasse" (
    "id_details_classe" TEXT NOT NULL,
    "liste_jours_cours" TEXT NOT NULL,
    "supports_pedagogiques" TEXT NOT NULL,
    "etat_actuel" TEXT NOT NULL,

    CONSTRAINT "DetailsClasse_pkey" PRIMARY KEY ("id_details_classe")
);

-- CreateTable
CREATE TABLE "CategorieCours" (
    "id_categorie" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CategorieCours_pkey" PRIMARY KEY ("id_categorie")
);

-- CreateTable
CREATE TABLE "Cours" (
    "id_cours" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "fichierAssocies" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL,
    "horaires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cours_pkey" PRIMARY KEY ("id_cours")
);

-- CreateTable
CREATE TABLE "Exclus" (
    "id_exclusion" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_exclusion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exclus_pkey" PRIMARY KEY ("id_exclusion")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id_programme" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duree" TIMESTAMP(3) NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TEXT NOT NULL,
    "vacances" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id_programme")
);

-- CreateTable
CREATE TABLE "Formateur" (
    "id_formateur" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "prochain_cours" TEXT,
    "status_actuel" TEXT NOT NULL,
    "fin_cours" TIMESTAMP(3),
    "id_programme" TEXT,

    CONSTRAINT "Formateur_pkey" PRIMARY KEY ("id_formateur")
);

-- CreateTable
CREATE TABLE "Classe" (
    "id_classe" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "id_horaire" TEXT NOT NULL,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id_classe")
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "id_etudiant" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "id_exclusion" TEXT,
    "id_programme" TEXT NOT NULL,
    "id_classe" TEXT NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id_etudiant")
);

-- CreateTable
CREATE TABLE "DetailsEtudiant" (
    "id" TEXT NOT NULL,
    "progres" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "commentaires" TEXT NOT NULL,
    "derniere_connexion" TIMESTAMP(3) NOT NULL,
    "id_etudiant" TEXT NOT NULL,

    CONSTRAINT "DetailsEtudiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dateNotification" TIMESTAMP(3) NOT NULL,
    "id_etudiant" TEXT NOT NULL,
    "id_formateur" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avoir" (
    "id_formateur" TEXT NOT NULL,
    "id_etudiant" TEXT NOT NULL,

    CONSTRAINT "Avoir_pkey" PRIMARY KEY ("id_formateur","id_etudiant")
);

-- CreateTable
CREATE TABLE "Lister" (
    "id_classe" TEXT NOT NULL,
    "id_details_classe" TEXT NOT NULL,

    CONSTRAINT "Lister_pkey" PRIMARY KEY ("id_classe","id_details_classe")
);

-- CreateTable
CREATE TABLE "Programmer" (
    "id_formateur" TEXT NOT NULL,
    "horaires_id" TEXT NOT NULL,

    CONSTRAINT "Programmer_pkey" PRIMARY KEY ("id_formateur","horaires_id")
);

-- CreateTable
CREATE TABLE "Disposer" (
    "id_formateur" TEXT NOT NULL,
    "id_ressources" TEXT NOT NULL,

    CONSTRAINT "Disposer_pkey" PRIMARY KEY ("id_formateur","id_ressources")
);

-- CreateTable
CREATE TABLE "Consulter" (
    "id_etudiant" TEXT NOT NULL,
    "id_ressources" TEXT NOT NULL,

    CONSTRAINT "Consulter_pkey" PRIMARY KEY ("id_etudiant","id_ressources")
);

-- CreateTable
CREATE TABLE "Donner" (
    "id_formateur" TEXT NOT NULL,
    "id_cours" TEXT NOT NULL,

    CONSTRAINT "Donner_pkey" PRIMARY KEY ("id_formateur","id_cours")
);

-- CreateTable
CREATE TABLE "Apprendre" (
    "id_etudiant" TEXT NOT NULL,
    "id_cours" TEXT NOT NULL,

    CONSTRAINT "Apprendre_pkey" PRIMARY KEY ("id_etudiant","id_cours")
);

-- CreateTable
CREATE TABLE "Repartir" (
    "id_categorie" TEXT NOT NULL,
    "id_cours" TEXT NOT NULL,

    CONSTRAINT "Repartir_pkey" PRIMARY KEY ("id_categorie","id_cours")
);

-- AddForeignKey
ALTER TABLE "Formateur" ADD CONSTRAINT "Formateur_id_programme_fkey" FOREIGN KEY ("id_programme") REFERENCES "Programme"("id_programme") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classe" ADD CONSTRAINT "Classe_id_horaire_fkey" FOREIGN KEY ("id_horaire") REFERENCES "Horaires"("id_horaire") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_id_classe_fkey" FOREIGN KEY ("id_classe") REFERENCES "Classe"("id_classe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_id_exclusion_fkey" FOREIGN KEY ("id_exclusion") REFERENCES "Exclus"("id_exclusion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_id_programme_fkey" FOREIGN KEY ("id_programme") REFERENCES "Programme"("id_programme") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailsEtudiant" ADD CONSTRAINT "DetailsEtudiant_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_id_formateur_fkey" FOREIGN KEY ("id_formateur") REFERENCES "Formateur"("id_formateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avoir" ADD CONSTRAINT "Avoir_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avoir" ADD CONSTRAINT "Avoir_id_formateur_fkey" FOREIGN KEY ("id_formateur") REFERENCES "Formateur"("id_formateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lister" ADD CONSTRAINT "Lister_id_classe_fkey" FOREIGN KEY ("id_classe") REFERENCES "Classe"("id_classe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lister" ADD CONSTRAINT "Lister_id_details_classe_fkey" FOREIGN KEY ("id_details_classe") REFERENCES "DetailsClasse"("id_details_classe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programmer" ADD CONSTRAINT "Programmer_horaires_id_fkey" FOREIGN KEY ("horaires_id") REFERENCES "Horaires"("id_horaire") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Programmer" ADD CONSTRAINT "Programmer_id_formateur_fkey" FOREIGN KEY ("id_formateur") REFERENCES "Formateur"("id_formateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposer" ADD CONSTRAINT "Disposer_id_formateur_fkey" FOREIGN KEY ("id_formateur") REFERENCES "Formateur"("id_formateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disposer" ADD CONSTRAINT "Disposer_id_ressources_fkey" FOREIGN KEY ("id_ressources") REFERENCES "Ressources"("id_ressources") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulter" ADD CONSTRAINT "Consulter_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulter" ADD CONSTRAINT "Consulter_id_ressources_fkey" FOREIGN KEY ("id_ressources") REFERENCES "Ressources"("id_ressources") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donner" ADD CONSTRAINT "Donner_id_cours_fkey" FOREIGN KEY ("id_cours") REFERENCES "Cours"("id_cours") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donner" ADD CONSTRAINT "Donner_id_formateur_fkey" FOREIGN KEY ("id_formateur") REFERENCES "Formateur"("id_formateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprendre" ADD CONSTRAINT "Apprendre_id_cours_fkey" FOREIGN KEY ("id_cours") REFERENCES "Cours"("id_cours") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apprendre" ADD CONSTRAINT "Apprendre_id_etudiant_fkey" FOREIGN KEY ("id_etudiant") REFERENCES "Etudiant"("id_etudiant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repartir" ADD CONSTRAINT "Repartir_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "CategorieCours"("id_categorie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repartir" ADD CONSTRAINT "Repartir_id_cours_fkey" FOREIGN KEY ("id_cours") REFERENCES "Cours"("id_cours") ON DELETE RESTRICT ON UPDATE CASCADE;
