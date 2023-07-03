-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ClinicalApproach" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Therapist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT NOT NULL,
    "crp" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_ClinicalApproachToTherapist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClinicalApproachToTherapist_A_fkey" FOREIGN KEY ("A") REFERENCES "ClinicalApproach" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClinicalApproachToTherapist_B_fkey" FOREIGN KEY ("B") REFERENCES "Therapist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalApproach_name_key" ON "ClinicalApproach"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_email_key" ON "Therapist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_telephone_key" ON "Therapist"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_crp_key" ON "Therapist"("crp");

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicalApproachToTherapist_AB_unique" ON "_ClinicalApproachToTherapist"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicalApproachToTherapist_B_index" ON "_ClinicalApproachToTherapist"("B");
