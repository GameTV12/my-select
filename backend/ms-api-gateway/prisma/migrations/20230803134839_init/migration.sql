-- CreateTable
CREATE TABLE "AuthUser" (
    "userId" TEXT NOT NULL,
    "linkNickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedRt" TEXT
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" UUID NOT NULL,
    "authUserUserId" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_userId_key" ON "AuthUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_linkNickname_key" ON "AuthUser"("linkNickname");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_authUserUserId_fkey" FOREIGN KEY ("authUserUserId") REFERENCES "AuthUser"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
