CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;
CREATE TABLE "Categories" (
    "CategoryId" INTEGER NOT NULL CONSTRAINT "PK_Categories" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NULL,
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

INSERT INTO "Users" ("UserId", "About", "Avatar", "Cover", "DisplayName", "Email", "Password", "Privacy", "Role", "Username", "UsersInfoId")
VALUES (1, 'Luis Carvalho', 'avatars/luis.jpg', 'covers/luis.jpg', 'Luis Carvalho', 'luiscarvalho239@gmail.com', '$2a$10$m9p22D4NIS1mXvgCRn1ume4avdPtBQ1LSeYMeJEtrw9gsG0wLfU6m', 0, 6, 'admin', 1);
SELECT changes();


INSERT INTO "Posts" ("PostId", "Content", "CreatedAt", "Image", "Slug", "Status", "Title", "UpdatedAt", "UserId")
VALUES (1, 'Welcome to LCPBlog!', '2025-02-22 17:01:20.8845786+00:00', 'blog.jpg', '/', 0, 'Welcome to LCPBlog!', '2025-02-22 17:01:20.8846077+00:00', 1);
SELECT changes();


CREATE INDEX "IX_Comments_PostId" ON "Comments" ("PostId");

CREATE INDEX "IX_Comments_UserId" ON "Comments" ("UserId");

CREATE INDEX "IX_PostCategories_CategoryId" ON "PostCategories" ("CategoryId");

CREATE INDEX "IX_Posts_UserId" ON "Posts" ("UserId");

CREATE INDEX "IX_PostTags_TagId" ON "PostTags" ("TagId");

CREATE INDEX "IX_RefreshToken_UserId" ON "RefreshToken" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250222170121_InitialCreateSQLite', '9.0.0');

COMMIT;

