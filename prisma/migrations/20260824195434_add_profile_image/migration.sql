-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImageKey" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;
