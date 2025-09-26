/*
  Warnings:

  - Added the required column `coverLetter` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cv` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."APP_STATUS" AS ENUM ('REVIEWING', 'PENDING', 'APPROVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."OTP_PURPOSE" AS ENUM ('ACCOUNT_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "coverLetter" TEXT NOT NULL,
ADD COLUMN     "cv" TEXT NOT NULL,
ADD COLUMN     "status" "public"."APP_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "otpHash" TEXT,
ADD COLUMN     "otpPurpose" "public"."OTP_PURPOSE",
ADD COLUMN     "otpUsed" BOOLEAN NOT NULL DEFAULT false;
