/*
  Warnings:

  - You are about to drop the column `lessonId` on the `lessoncourse` table. All the data in the column will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `lessoncourse` DROP FOREIGN KEY `LessonCourse_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `Submission_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `Submission_userId_fkey`;

-- DropIndex
DROP INDEX `LessonCourse_lessonId_fkey` ON `lessoncourse`;

-- AlterTable
ALTER TABLE `lesson` ADD COLUMN `isEdited` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastSyncedAt` DATETIME(3) NULL,
    ADD COLUMN `lessonSectionId` INTEGER NULL,
    ADD COLUMN `sourceUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `lessoncourse` DROP COLUMN `lessonId`;

-- DropTable
DROP TABLE `project`;

-- DropTable
DROP TABLE `submission`;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_lessonSectionId_fkey` FOREIGN KEY (`lessonSectionId`) REFERENCES `LessonSection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
