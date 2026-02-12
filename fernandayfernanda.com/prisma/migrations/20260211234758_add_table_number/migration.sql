-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "tableNumber" INTEGER;

-- CreateIndex
CREATE INDEX "Guest_tableNumber_idx" ON "Guest"("tableNumber");
