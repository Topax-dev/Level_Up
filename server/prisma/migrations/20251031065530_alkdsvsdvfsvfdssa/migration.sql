-- DropForeignKey
ALTER TABLE `progress` DROP FOREIGN KEY `Progress_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Progress` ADD CONSTRAINT `Progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
