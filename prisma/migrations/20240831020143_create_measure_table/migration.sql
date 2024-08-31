-- CreateTable
CREATE TABLE "Measure" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "hasConfirmed" BOOLEAN NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);
