/*
  Warnings:

  - You are about to drop the column `category` on the `Job` table. All the data in the column will be lost.
  - Added the required column `offerMax` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offerMin` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Job_category_title_idx";

-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "category",
ADD COLUMN     "offerMax" INTEGER NOT NULL,
ADD COLUMN     "offerMin" INTEGER NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "gender" TEXT;

-- CreateIndex
CREATE INDEX "Job_role_title_idx" ON "public"."Job"("role", "title");
