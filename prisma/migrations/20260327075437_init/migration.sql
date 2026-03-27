/*
  Warnings:

  - You are about to drop the column `Role` on the `WorkspaceMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkspaceMember" DROP COLUMN "Role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
