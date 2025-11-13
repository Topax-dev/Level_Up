/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `LessonSection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LessonSection_title_key` ON `LessonSection`(`title`);
