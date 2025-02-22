CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;
ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Categories` (
    `CategoryId` int NOT NULL AUTO_INCREMENT,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime NULL,
    `UpdatedAt` datetime NULL,
    `Status` int NULL,
    CONSTRAINT `PK_Categories` PRIMARY KEY (`CategoryId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `FilesMetadata` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `gId` char(36) COLLATE ascii_general_ci NOT NULL,
    `FileName` longtext CHARACTER SET utf8mb4 NOT NULL,
    `FilePath` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ContentType` longtext CHARACTER SET utf8mb4 NULL,
    `UploadedAt` datetime NULL,
    CONSTRAINT `PK_FilesMetadata` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Tags` (
    `TagId` int NOT NULL AUTO_INCREMENT,
    `Name` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime NULL,
    `UpdatedAt` datetime NULL,
    `Status` int NULL,
    CONSTRAINT `PK_Tags` PRIMARY KEY (`TagId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Users` (
    `UserId` int NOT NULL AUTO_INCREMENT,
    `Username` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Password` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Email` longtext CHARACTER SET utf8mb4 NULL,
    `DisplayName` longtext CHARACTER SET utf8mb4 NULL,
    `Avatar` longtext CHARACTER SET utf8mb4 NULL,
    `Cover` longtext CHARACTER SET utf8mb4 NULL,
    `About` longtext CHARACTER SET utf8mb4 NULL,
    `Role` int NULL,
    `Privacy` int NULL,
    `UsersInfoId` int NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`UserId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Posts` (
    `PostId` int NOT NULL AUTO_INCREMENT,
    `Title` longtext CHARACTER SET utf8mb4 NULL,
    `Content` longtext CHARACTER SET utf8mb4 NULL,
    `Image` longtext CHARACTER SET utf8mb4 NULL,
    `Slug` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime NULL,
    `UpdatedAt` datetime NULL,
    `Status` int NULL,
    `UserId` int NULL,
    CONSTRAINT `PK_Posts` PRIMARY KEY (`PostId`),
    CONSTRAINT `FK_Posts_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `RefreshToken` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Token` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Expires` datetime NOT NULL,
    `Created` datetime NOT NULL,
    `CreatedByIp` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Revoked` datetime NULL,
    `RevokedByIp` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ReplacedByToken` longtext CHARACTER SET utf8mb4 NOT NULL,
    `ReasonRevoked` longtext CHARACTER SET utf8mb4 NOT NULL,
    `UserId` int NOT NULL,
    CONSTRAINT `PK_RefreshToken` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_RefreshToken_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Comments` (
    `CommentId` int NOT NULL AUTO_INCREMENT,
    `Content` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime NULL,
    `UpdatedAt` datetime NULL,
    `Status` int NULL,
    `UserId` int NULL,
    `PostId` int NULL,
    CONSTRAINT `PK_Comments` PRIMARY KEY (`CommentId`),
    CONSTRAINT `FK_Comments_Posts_PostId` FOREIGN KEY (`PostId`) REFERENCES `Posts` (`PostId`),
    CONSTRAINT `FK_Comments_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `PostCategories` (
    `PostId` int NOT NULL,
    `CategoryId` int NOT NULL,
    CONSTRAINT `PK_PostCategories` PRIMARY KEY (`PostId`, `CategoryId`),
    CONSTRAINT `FK_PostCategories_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`CategoryId`) ON DELETE CASCADE,
    CONSTRAINT `FK_PostCategories_Posts_PostId` FOREIGN KEY (`PostId`) REFERENCES `Posts` (`PostId`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `PostTags` (
    `PostId` int NOT NULL,
    `TagId` int NOT NULL,
    CONSTRAINT `PK_PostTags` PRIMARY KEY (`PostId`, `TagId`),
    CONSTRAINT `FK_PostTags_Posts_PostId` FOREIGN KEY (`PostId`) REFERENCES `Posts` (`PostId`) ON DELETE CASCADE,
    CONSTRAINT `FK_PostTags_Tags_TagId` FOREIGN KEY (`TagId`) REFERENCES `Tags` (`TagId`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Comments_PostId` ON `Comments` (`PostId`);

CREATE INDEX `IX_Comments_UserId` ON `Comments` (`UserId`);

CREATE INDEX `IX_PostCategories_CategoryId` ON `PostCategories` (`CategoryId`);

CREATE INDEX `IX_Posts_UserId` ON `Posts` (`UserId`);

CREATE INDEX `IX_PostTags_TagId` ON `PostTags` (`TagId`);

CREATE INDEX `IX_RefreshToken_UserId` ON `RefreshToken` (`UserId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250222101700_InitialCreateMySQL', '9.0.0');

COMMIT;

