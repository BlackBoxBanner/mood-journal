/*
  Warnings:

  - You are about to alter the column `activities` on the `Mood` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Int`.

*/
-- AlterTable
ALTER TABLE `Mood` MODIFY `feel` TEXT NOT NULL,
    MODIFY `activities` INTEGER NOT NULL;
