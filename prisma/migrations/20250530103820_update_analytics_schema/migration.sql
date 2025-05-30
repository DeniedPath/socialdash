/*
  Warnings:

  - You are about to drop the column `followers` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `pageViews` on the `Analytics` table. All the data in the column will be lost.
  - Added the required column `platformId` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "followers",
DROP COLUMN "pageViews",
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "platformId" TEXT NOT NULL,
ADD COLUMN     "recentActivity" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "subscriberChange" TEXT,
ADD COLUMN     "subscriberChangeType" TEXT,
ADD COLUMN     "topContent" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- CreateIndex
CREATE INDEX "Analytics_platformId_idx" ON "Analytics"("platformId");

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
