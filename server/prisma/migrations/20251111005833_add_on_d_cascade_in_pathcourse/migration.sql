-- DropForeignKey
ALTER TABLE `pathcourse` DROP FOREIGN KEY `PathCourse_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `pathcourse` DROP FOREIGN KEY `PathCourse_pathId_fkey`;

-- DropIndex
DROP INDEX `PathCourse_courseId_fkey` ON `pathcourse`;

-- AddForeignKey
ALTER TABLE `PathCourse` ADD CONSTRAINT `PathCourse_pathId_fkey` FOREIGN KEY (`pathId`) REFERENCES `Path`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PathCourse` ADD CONSTRAINT `PathCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
