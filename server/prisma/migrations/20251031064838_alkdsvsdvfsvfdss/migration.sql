/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Path` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Path_name_key` ON `Path`(`name`);
