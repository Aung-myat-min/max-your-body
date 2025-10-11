-- AlterTable
ALTER TABLE "VerificationCode" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "usedAt" TIMESTAMP(3);
