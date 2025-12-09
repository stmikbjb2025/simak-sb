/*
  Warnings:

  - You are about to drop the column `roomId` on the `sb25_academic_classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[periodId,name,courseId]` on the table `sb25_academic_classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[npk]` on the table `sb25_lecturers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nidn]` on the table `sb25_lecturers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nuptk]` on the table `sb25_lecturers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."sb25_academic_classes" DROP CONSTRAINT "sb25_academic_classes_roomId_fkey";

-- DropIndex
DROP INDEX "public"."sb25_academic_classes_periodId_name_lecturerId_courseId_roo_key";

-- AlterTable
ALTER TABLE "sb25_academic_classes" DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "sb25_schedule_details" ADD COLUMN     "roomId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "sb25_academic_classes_periodId_name_courseId_key" ON "sb25_academic_classes"("periodId", "name", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_lecturers_npk_key" ON "sb25_lecturers"("npk");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_lecturers_nidn_key" ON "sb25_lecturers"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_lecturers_nuptk_key" ON "sb25_lecturers"("nuptk");

-- AddForeignKey
ALTER TABLE "sb25_schedule_details" ADD CONSTRAINT "sb25_schedule_details_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "sb25_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
