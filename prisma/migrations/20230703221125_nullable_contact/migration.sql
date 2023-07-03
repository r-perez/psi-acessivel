-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Therapist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "crp" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Therapist" ("address", "createdAt", "crp", "email", "id", "name", "telephone", "updatedAt") SELECT "address", "createdAt", "crp", "email", "id", "name", "telephone", "updatedAt" FROM "Therapist";
DROP TABLE "Therapist";
ALTER TABLE "new_Therapist" RENAME TO "Therapist";
CREATE UNIQUE INDEX "Therapist_email_key" ON "Therapist"("email");
CREATE UNIQUE INDEX "Therapist_telephone_key" ON "Therapist"("telephone");
CREATE UNIQUE INDEX "Therapist_crp_key" ON "Therapist"("crp");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
