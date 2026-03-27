-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- AlterTable
ALTER TABLE "WorkspaceMember" ADD COLUMN     "Role" "Role" NOT NULL DEFAULT 'MEMBER';
