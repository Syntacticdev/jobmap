-- CreateEnum
CREATE TYPE "public"."ROLE" AS ENUM ('FREELANCER', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."STATUS" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(56) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "public"."ROLE" NOT NULL DEFAULT 'FREELANCER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "overview" VARCHAR(2000) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "public"."STATUS" NOT NULL DEFAULT 'OPEN',
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Social" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "link" VARCHAR(100) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Job_category_title_idx" ON "public"."Job"("category", "title");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Social" ADD CONSTRAINT "Social_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
