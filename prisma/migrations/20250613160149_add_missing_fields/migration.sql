-- Create OrderStatus enum type first
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- Add missing fields to OrderItem table
ALTER TABLE "OrderItem" ADD COLUMN "combinationId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "OrderItem" ADD COLUMN "reason" TEXT;

-- Add missing field to Order table
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'COD';

-- Add medicine support to CartItem
ALTER TABLE "CartItem" ADD COLUMN "medicineId" TEXT;
ALTER TABLE "CartItem" ALTER COLUMN "productId" DROP NOT NULL;

-- Create ProductImage table
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_combinationId_fkey" FOREIGN KEY ("combinationId") REFERENCES "ProductVariantCombination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_combinationId_fkey" FOREIGN KEY ("combinationId") REFERENCES "ProductVariantCombination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
