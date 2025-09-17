-- Drop old foreign keys
ALTER TABLE "ProductOnCart" DROP CONSTRAINT IF EXISTS "ProductOnCart_cartId_fkey";
ALTER TABLE "ProductOnCart" DROP CONSTRAINT IF EXISTS "ProductOnCart_productId_fkey";

-- Add new foreign keys
ALTER TABLE "ProductOnCart" ADD CONSTRAINT "ProductOnCart_cartId_fkey"
    FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductOnCart" ADD CONSTRAINT "ProductOnCart_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
