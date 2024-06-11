/*
  Warnings:

  - You are about to alter the column `feel` on the `Mood` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Int`.

*/
-- AlterTable
ALTER TABLE `Mood` MODIFY `feel` INTEGER NOT NULL,
    MODIFY `activities` TEXT NOT NULL;
