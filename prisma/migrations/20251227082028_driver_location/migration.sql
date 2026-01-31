-- CreateTable
CREATE TABLE "DriverLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    CONSTRAINT "DriverLocation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DriverLocation_driverId_key" ON "DriverLocation"("driverId");
