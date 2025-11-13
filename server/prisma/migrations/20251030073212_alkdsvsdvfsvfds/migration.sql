/*
  Warnings:

  - Added the required column `orderIndex` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `orderIndex` INTEGER NOT NULL;
