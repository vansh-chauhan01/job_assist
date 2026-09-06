-- AlterTable
ALTER TABLE "Interviews" ADD COLUMN     "resumeId" INTEGER,
ALTER COLUMN "transcript" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Interviews" ADD CONSTRAINT "Interviews_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
