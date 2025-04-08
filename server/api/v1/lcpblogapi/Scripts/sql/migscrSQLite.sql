CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;
CREATE TABLE "Categories" (
    "CategoryId" INTEGER NOT NULL CONSTRAINT "PK_Categories" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NULL,
    "Slug" TEXT NULL,
    "CreatedAt" TEXT NULL,
    "UpdatedAt" TEXT NULL,
    "Status" INTEGER NULL
);

CREATE TABLE "FilesMetadata" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_FilesMetadata" PRIMARY KEY AUTOINCREMENT,
    "gId" TEXT NULL,
    "FileName" TEXT NOT NULL,
    "FilePath" TEXT NOT NULL,
    "ContentType" TEXT NULL,
    "UploadedAt" TEXT NULL
);

CREATE TABLE "Schedule" (
    "ScheduleId" INTEGER NOT NULL CONSTRAINT "PK_Schedule" PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "DateStart" TEXT NOT NULL,
    "DateEnd" TEXT NOT NULL,
    "AllDay" INTEGER NULL
);

CREATE TABLE "Tags" (
    "TagId" INTEGER NOT NULL CONSTRAINT "PK_Tags" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NULL,
    "CreatedAt" TEXT NULL,
    "UpdatedAt" TEXT NULL,
    "Status" INTEGER NULL
);

CREATE TABLE "Users" (
    "UserId" INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Email" TEXT NULL,
    "DisplayName" TEXT NULL,
    "Avatar" TEXT NULL,
    "Cover" TEXT NULL,
    "About" TEXT NULL,
    "Role" INTEGER NULL,
    "Privacy" INTEGER NULL,
    "UsersInfoId" INTEGER NULL
);

CREATE TABLE "Posts" (
    "PostId" INTEGER NOT NULL CONSTRAINT "PK_Posts" PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NULL,
    "Content" TEXT NULL,
    "Image" TEXT NULL,
    "Slug" TEXT NULL,
    "Views" INTEGER NULL,
    "ViewsCounter" INTEGER NULL,
    "CategoryId" INTEGER NULL,
    "CreatedAt" TEXT NULL,
    "UpdatedAt" TEXT NULL,
    "Status" INTEGER NULL,
    "UserId" INTEGER NULL,
    CONSTRAINT "FK_Posts_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId")
);

CREATE TABLE "RefreshToken" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_RefreshToken" PRIMARY KEY AUTOINCREMENT,
    "Token" TEXT NOT NULL,
    "Expires" TEXT NOT NULL,
    "Created" TEXT NOT NULL,
    "CreatedByIp" TEXT NOT NULL,
    "Revoked" TEXT NULL,
    "RevokedByIp" TEXT NOT NULL,
    "ReplacedByToken" TEXT NOT NULL,
    "ReasonRevoked" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    CONSTRAINT "FK_RefreshToken_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId") ON DELETE CASCADE
);

CREATE TABLE "Comments" (
    "CommentId" INTEGER NOT NULL CONSTRAINT "PK_Comments" PRIMARY KEY AUTOINCREMENT,
    "Content" TEXT NULL,
    "CreatedAt" TEXT NULL,
    "UpdatedAt" TEXT NULL,
    "Status" INTEGER NULL,
    "UserId" INTEGER NULL,
    "PostId" INTEGER NULL,
    CONSTRAINT "FK_Comments_Posts_PostId" FOREIGN KEY ("PostId") REFERENCES "Posts" ("PostId"),
    CONSTRAINT "FK_Comments_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId")
);

CREATE TABLE "PostCategories" (
    "PostId" INTEGER NOT NULL,
    "CategoryId" INTEGER NOT NULL,
    CONSTRAINT "PK_PostCategories" PRIMARY KEY ("PostId", "CategoryId"),
    CONSTRAINT "FK_PostCategories_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("CategoryId") ON DELETE CASCADE,
    CONSTRAINT "FK_PostCategories_Posts_PostId" FOREIGN KEY ("PostId") REFERENCES "Posts" ("PostId") ON DELETE CASCADE
);

CREATE TABLE "PostTags" (
    "PostId" INTEGER NOT NULL,
    "TagId" INTEGER NOT NULL,
    CONSTRAINT "PK_PostTags" PRIMARY KEY ("PostId", "TagId"),
    CONSTRAINT "FK_PostTags_Posts_PostId" FOREIGN KEY ("PostId") REFERENCES "Posts" ("PostId") ON DELETE CASCADE,
    CONSTRAINT "FK_PostTags_Tags_TagId" FOREIGN KEY ("TagId") REFERENCES "Tags" ("TagId") ON DELETE CASCADE
);

INSERT INTO "Categories" ("CategoryId", "CreatedAt", "Name", "Slug", "Status", "UpdatedAt")
VALUES (1, '2025-04-08 14:30:49.3659303+01:00', 'Geral', '/geral', 0, '2025-04-08 14:30:49.3659584+01:00');
SELECT changes();

INSERT INTO "Categories" ("CategoryId", "CreatedAt", "Name", "Slug", "Status", "UpdatedAt")
VALUES (2, '2025-04-08 14:30:49.3659855+01:00', 'Tecnologia', '/tecnologia', 0, '2025-04-08 14:30:49.3659858+01:00');
SELECT changes();

INSERT INTO "Categories" ("CategoryId", "CreatedAt", "Name", "Slug", "Status", "UpdatedAt")
VALUES (3, '2025-04-08 14:30:49.3659865+01:00', 'Outros', '/outros', 0, '2025-04-08 14:30:49.3659867+01:00');
SELECT changes();


INSERT INTO "Users" ("UserId", "About", "Avatar", "Cover", "DisplayName", "Email", "Password", "Privacy", "Role", "Username", "UsersInfoId")
VALUES (1, 'Luis Carvalho', 'avatars/luis.jpg', 'covers/luis.jpg', 'Luis Carvalho', 'luiscarvalho239@gmail.com', '$2a$10$b4l3vOTFk18J29oxY3h1O.CMdhFNIRs7e6J7cd.rWk.34toJyo0uS', 0, 6, 'admin', 1);
SELECT changes();


INSERT INTO "Posts" ("PostId", "CategoryId", "Content", "CreatedAt", "Image", "Slug", "Status", "Title", "UpdatedAt", "UserId", "Views", "ViewsCounter")
VALUES (1, 1, 'Welcome to LCPBlog!', '2025-04-08 14:30:49.3652457+01:00', 'blog.jpg', '/', 0, 'Welcome to LCPBlog!', '2025-04-08 14:30:49.3652741+01:00', 1, 0, 0);
SELECT changes();


CREATE INDEX "IX_Comments_PostId" ON "Comments" ("PostId");

CREATE INDEX "IX_Comments_UserId" ON "Comments" ("UserId");

CREATE INDEX "IX_PostCategories_CategoryId" ON "PostCategories" ("CategoryId");

CREATE INDEX "IX_Posts_UserId" ON "Posts" ("UserId");

CREATE INDEX "IX_PostTags_TagId" ON "PostTags" ("TagId");

CREATE INDEX "IX_RefreshToken_UserId" ON "RefreshToken" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250408133050_InitialCreateSQLite', '9.0.0');

COMMIT;

