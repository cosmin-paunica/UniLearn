-- -- DropForeignKey
-- ALTER TABLE `assignment_file_uploads` DROP FOREIGN KEY `assignment_file_uploads_assignmentId_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `assignment_file_uploads` DROP FOREIGN KEY `assignment_file_uploads_studentId_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `assignments` DROP FOREIGN KEY `assignments_courseId_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `users_in_courses` DROP FOREIGN KEY `users_in_courses_courseId_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `users_in_courses` DROP FOREIGN KEY `users_in_courses_userId_fkey`;

-- -- AddForeignKey
-- ALTER TABLE `users_in_courses` ADD CONSTRAINT `users_in_courses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `users_in_courses` ADD CONSTRAINT `users_in_courses_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `assignments` ADD CONSTRAINT `assignments_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE `assignment_file_uploads` ADD CONSTRAINT `assignment_file_uploads_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- -- AddForeignKey
-- ALTER TABLE `assignment_file_uploads` ADD CONSTRAINT `assignment_file_uploads_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignments`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;
