/*
  Warnings:

  - A unique constraint covering the columns `[majorId,name,sks]` on the table `sb25_courses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sb25_courses_majorId_name_sks_key" ON "sb25_courses"("majorId", "name", "sks");
