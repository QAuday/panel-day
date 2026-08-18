-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "percentOff" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "shippingFee" INTEGER NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "fulfillmentStatus" TEXT NOT NULL DEFAULT 'processing',
    "carrierName" TEXT,
    "trackingNumber" TEXT,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("address", "carrierName", "city", "createdAt", "customerName", "email", "fulfillmentStatus", "id", "paymentMethod", "phone", "pincode", "razorpayOrderId", "razorpayPaymentId", "shippingFee", "state", "status", "trackingNumber") SELECT "address", "carrierName", "city", "createdAt", "customerName", "email", "fulfillmentStatus", "id", "paymentMethod", "phone", "pincode", "razorpayOrderId", "razorpayPaymentId", "shippingFee", "state", "status", "trackingNumber" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
