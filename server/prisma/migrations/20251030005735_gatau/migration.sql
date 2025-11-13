/*
  Warnings:

  - You are about to drop the column `courseId` on the `lesson` table. All the data in the column will be lost.
  - You are about to drop the column `lessonSectionId` on the `lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_lessonSectionId_fkey`;

-- DropIndex
DROP INDEX `Lesson_lessonSectionId_fkey` ON `lesson`;

-- AlterTable
ALTER TABLE `lesson` DROP COLUMN `courseId`,
    DROP COLUMN `lessonSectionId`,
    MODIFY `type` ENUM('WATCH', 'READING', 'PROJECT', 'QUIZ') NOT NULL;
