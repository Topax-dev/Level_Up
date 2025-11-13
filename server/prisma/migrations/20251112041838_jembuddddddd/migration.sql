/*
  Warnings:

  - Added the required column `explanation` to the `ActionAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `actionadmin` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `explanation` VARCHAR(191) NOT NULL;
