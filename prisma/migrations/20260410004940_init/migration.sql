-- CreateTable
CREATE TABLE `Jacket` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `imagenUrl` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` VARCHAR(191) NOT NULL,
    `clienteNombre` VARCHAR(191) NOT NULL,
    `clienteEmail` VARCHAR(191) NOT NULL,
    `jacketId` VARCHAR(191) NOT NULL,
    `imagenDisenioUrl` VARCHAR(191) NOT NULL,
    `precioChaqueta` DECIMAL(10, 2) NOT NULL,
    `precioDisenio` DECIMAL(10, 2) NOT NULL DEFAULT 40,
    `total` DECIMAL(10, 2) NOT NULL,
    `estado` ENUM('pendiente', 'confirmado', 'enviado') NOT NULL DEFAULT 'pendiente',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_jacketId_fkey` FOREIGN KEY (`jacketId`) REFERENCES `Jacket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
