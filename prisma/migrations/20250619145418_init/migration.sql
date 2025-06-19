-- CreateTable
CREATE TABLE "ModuleTitle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Module" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moduleName" TEXT NOT NULL,
    "moduleTitle" TEXT NOT NULL,
    "type" TEXT DEFAULT 'MATERIAL',
    "file" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleTitle_name_key" ON "ModuleTitle"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Module_moduleName_key" ON "Module"("moduleName");
