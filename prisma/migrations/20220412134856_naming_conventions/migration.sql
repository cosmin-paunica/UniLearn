/*
  Warnings:

  - You are about to drop the `userincourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userincourse` DROP FOREIGN KEY `UserInCourse_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `userincourse` DROP FOREIGN KEY `UserInCourse_userId_fkey`;

-- DropTable
DROP TABLE `userincourse`;

-- CreateTable
CREATE TABLE `users_in_courses` (
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `userRole` ENUM('PROFESSOR', 'STUDENT') NOT NULL,

    PRIMARY KEY (`userId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users_in_courses` ADD CONSTRAINT `users_in_courses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_in_courses` ADD CONSTRAINT `users_in_courses_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
