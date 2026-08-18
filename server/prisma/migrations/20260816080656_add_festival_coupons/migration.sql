-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "percentOff" INTEGER,
    "flatOff" INTEGER,
    "minUnitPrice" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Coupon" ("active", "code", "createdAt", "firstOrderOnly", "id", "percentOff") SELECT "active", "code", "createdAt", "firstOrderOnly", "id", "percentOff" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
