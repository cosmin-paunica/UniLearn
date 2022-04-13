/*
  Warnings:

  - Added the required column `semester` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `semester` INTEGER NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;
