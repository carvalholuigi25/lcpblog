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

CREATE TABLE "LoginStatus" (
    "LoginStatusId" INTEGER NOT NULL CONSTRAINT "PK_LoginStatus" PRIMARY KEY AUTOINCREMENT,
    "Attempts" INTEGER NOT NULL,
    "Status" INTEGER NULL,
    "DateLock" TEXT NULL,
    "DateLockTimestamp" INTEGER NULL,
    "Type" INTEGER NULL,
    "ModeTimer" INTEGER NULL,
    "ValueTimer" TEXT NULL,
    "UserId" INTEGER NULL
);

CREATE TABLE "Medias" (
    "MediaId" INTEGER NOT NULL CONSTRAINT "PK_Medias" PRIMARY KEY AUTOINCREMENT,
    "Src" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Thumbnail" TEXT NULL,
    "Title" TEXT NULL,
    "Description" TEXT NULL,
    "Privacy" TEXT NULL,
    "IsFeatured" INTEGER NULL,
    "CreatedAt" TEXT NULL,
    "UpdatedAt" TEXT NULL,
    "CategoryId" INTEGER NULL,
    "UserId" INTEGER NULL
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
    "Tags" TEXT NULL,
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
VALUES (1, '2025-06-11 11:33:28.8899943+01:00', 'Geral', '/geral', 0, '2025-06-11 11:33:28.8900681+01:00');
SELECT changes();

INSERT INTO "Categories" ("CategoryId", "CreatedAt", "Name", "Slug", "Status", "UpdatedAt")
VALUES (2, '2025-06-11 11:33:28.8901311+01:00', 'Tecnologia', '/tecnologia', 0, '2025-06-11 11:33:28.8901317+01:00');
SELECT changes();

INSERT INTO "Categories" ("CategoryId", "CreatedAt", "Name", "Slug", "Status", "UpdatedAt")
VALUES (3, '2025-06-11 11:33:28.8901331+01:00', 'Outros', '/outros', 0, '2025-06-11 11:33:28.8901335+01:00');
SELECT changes();


INSERT INTO "LoginStatus" ("LoginStatusId", "Attempts", "DateLock", "DateLockTimestamp", "ModeTimer", "Status", "Type", "UserId", "ValueTimer")
VALUES (1, 0, NULL, 0, 6, 1, 0, 1, '');
SELECT changes();


INSERT INTO "Medias" ("MediaId", "CategoryId", "CreatedAt", "Description", "IsFeatured", "Privacy", "Src", "Thumbnail", "Title", "Type", "UpdatedAt", "UserId")
VALUES (1, 1, '2025-06-11 11:33:28.9064874+01:00', 'This is a demo video', 1, 'public', '//vjs.zencdn.net/v/oceans.mp4', 'videos/thumbnails/default.jpg', 'Demo', 'video/mp4', '2025-06-11 11:33:28.9065433+01:00', 1);
SELECT changes();


INSERT INTO "Users" ("UserId", "About", "Avatar", "Cover", "DisplayName", "Email", "Password", "Privacy", "Role", "Username", "UsersInfoId")
VALUES (1, 'Luis Carvalho', 'avatars/luis.jpg', 'covers/luis.jpg', 'Luis Carvalho', 'luiscarvalho239@gmail.com', '$2a$10$C1pDBkI7qFLR1KvpdVD29OqsezZJ6LlJ3PEr6j4IMBWIIk/XzT8nO', 0, 6, 'admin', 1);
SELECT changes();


INSERT INTO "Posts" ("PostId", "CategoryId", "Content", "CreatedAt", "Image", "Slug", "Status", "Tags", "Title", "UpdatedAt", "UserId", "Views", "ViewsCounter")
VALUES (1, 1, 'Welcome to LCPBlog!', '2025-06-11 11:33:28.8886054+01:00', 'blog.jpg', '/', 0, '["#geral"]', 'Welcome to LCPBlog!', '2025-06-11 11:33:28.8886645+01:00', 1, 0, 0);
SELECT changes();


CREATE INDEX "IX_Comments_PostId" ON "Comments" ("PostId");

CREATE INDEX "IX_Comments_UserId" ON "Comments" ("UserId");

CREATE INDEX "IX_PostCategories_CategoryId" ON "PostCategories" ("CategoryId");

CREATE INDEX "IX_Posts_UserId" ON "Posts" ("UserId");

CREATE INDEX "IX_PostTags_TagId" ON "PostTags" ("TagId");

CREATE INDEX "IX_RefreshToken_UserId" ON "RefreshToken" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250611103330_InitialCreateSQLite', '9.0.0');

COMMIT;

