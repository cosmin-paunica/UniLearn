/*
  Warnings:

  - The primary key for the `assignment_file_uploads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `assignment_file_uploads` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `assignment_file_uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assignment_file_uploads` DROP FOREIGN KEY `assignment_file_uploads_userId_fkey`;

-- AlterTable
ALTER TABLE `assignment_file_uploads` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`assignmentId`, `studentId`);

-- AddForeignKey
ALTER TABLE `assignment_file_uploads` ADD CONSTRAINT `assignment_file_uploads_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
