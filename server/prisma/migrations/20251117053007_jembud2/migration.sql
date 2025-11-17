-- DropForeignKey
ALTER TABLE `lessoncourse` DROP FOREIGN KEY `LessonCourse_lessonSectionId_fkey`;

-- DropIndex
DROP INDEX `LessonCourse_lessonSectionId_fkey` ON `lessoncourse`;

-- AddForeignKey
ALTER TABLE `LessonCourse` ADD CONSTRAINT `LessonCourse_lessonSectionId_fkey` FOREIGN KEY (`lessonSectionId`) REFERENCES `LessonSection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
