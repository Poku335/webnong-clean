-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
