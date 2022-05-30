/*
  Warnings:

  - The primary key for the `assignment_file_uploads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `assignment_file_uploads` table. All the data in the column will be lost.
  - Added the required column `userId` to the `assignment_file_uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assignment_file_uploads` DROP FOREIGN KEY `assignment_file_uploads_studentId_fkey`;

-- AlterTable
ALTER TABLE `assignment_file_uploads` DROP PRIMARY KEY,
    DROP COLUMN `studentId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`assignmentId`, `userId`);

-- AddForeignKey
ALTER TABLE `assignment_file_uploads` ADD CONSTRAINT `assignment_file_uploads_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
