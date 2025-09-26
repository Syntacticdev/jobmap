/*
  Warnings:

  - You are about to drop the column `clientId` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Social` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Job" DROP CONSTRAINT "Job_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "clientId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_id_key" ON "public"."Job"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Social_id_key" ON "public"."Social"("id");

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
