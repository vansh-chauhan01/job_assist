/*
  Warnings:

  - You are about to drop the column `filePath` on the `resume` table. All the data in the column will be lost.
  - Added the required column `resumeUrl` to the `resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resume" DROP COLUMN "filePath",
ADD COLUMN     "resumeUrl" TEXT NOT NULL;
