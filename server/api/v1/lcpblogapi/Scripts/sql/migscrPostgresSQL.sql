﻿CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Categories" (
    "CategoryId" integer GENERATED BY DEFAULT AS IDENTITY,
    "Name" text,
    "CreatedAt" timestamp with time zone,
    "UpdatedAt" timestamp with time zone,
    "Status" integer,
    CONSTRAINT "PK_Categories" PRIMARY KEY ("CategoryId")
);

CREATE TABLE "FilesMetadata" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "gId" uuid NOT NULL,
    "FileName" text NOT NULL,
    "FilePath" text NOT NULL,
    "ContentType" text,
    "UploadedAt" timestamp with time zone,
    CONSTRAINT "PK_FilesMetadata" PRIMARY KEY ("Id")
);

CREATE TABLE "Tags" (
    "TagId" integer GENERATED BY DEFAULT AS IDENTITY,
    "Name" text,
    "CreatedAt" timestamp with time zone,
    "UpdatedAt" timestamp with time zone,
    "Status" integer,
    CONSTRAINT "PK_Tags" PRIMARY KEY ("TagId")
);

CREATE TABLE "Users" (
    "UserId" integer GENERATED BY DEFAULT AS IDENTITY,
    "Username" text NOT NULL,
    "Password" text NOT NULL,
    "Email" text,
    "DisplayName" text,
    "Avatar" text,
    "Cover" text,
    "About" text,
    "Role" integer,
    "Privacy" integer,
    "UsersInfoId" integer,
    CONSTRAINT "PK_Users" PRIMARY KEY ("UserId")
);

CREATE TABLE "Posts" (
    "PostId" integer GENERATED BY DEFAULT AS IDENTITY,
    "Title" text,
    "Content" text,
    "Image" text,
    "Slug" text,
    "CreatedAt" timestamp with time zone,
    "UpdatedAt" timestamp with time zone,
    "Status" integer,
    "UserId" integer,
    CONSTRAINT "PK_Posts" PRIMARY KEY ("PostId"),
    CONSTRAINT "FK_Posts_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId")
);

CREATE TABLE "RefreshToken" (
    "Id" integer GENERATED BY DEFAULT AS IDENTITY,
    "Token" text NOT NULL,
    "Expires" timestamp with time zone NOT NULL,
    "Created" timestamp with time zone NOT NULL,
    "CreatedByIp" text NOT NULL,
    "Revoked" timestamp with time zone,
    "RevokedByIp" text NOT NULL,
    "ReplacedByToken" text NOT NULL,
    "ReasonRevoked" text NOT NULL,
    "UserId" integer NOT NULL,
    CONSTRAINT "PK_RefreshToken" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RefreshToken_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId") ON DELETE CASCADE
);

CREATE TABLE "Comments" (
    "CommentId" integer GENERATED BY DEFAULT AS IDENTITY,
    "Content" text,
    "CreatedAt" timestamp with time zone,
    "UpdatedAt" timestamp with time zone,
    "Status" integer,
    "UserId" integer,
    "PostId" integer,
    CONSTRAINT "PK_Comments" PRIMARY KEY ("CommentId"),
    CONSTRAINT "FK_Comments_Posts_PostId" FOREIGN KEY ("PostId") REFERENCES "Posts" ("PostId"),
    CONSTRAINT "FK_Comments_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("UserId")
);

CREATE TABLE "PostCategories" (
    "PostId" integer NOT NULL,
    "CategoryId" integer NOT NULL,
    CONSTRAINT "PK_PostCategories" PRIMARY KEY ("PostId", "CategoryId"),
    CONSTRAINT "FK_PostCategories_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("CategoryId") ON DELETE CASCADE,
    CONSTRAINT "FK_PostCategories_Posts_PostId" FOREIGN KEY ("PostId") REFERENCES "Posts" ("PostId") ON DELETE CASCADE
);

CREATE TABLE "PostTags" (
    "PostId" integer NOT NULL,
    "TagId" integer NOT NULL,
    CONSTRAINT "PK_PostTags" PRIMARY KEY ("PostId", "TagId"),
    CONSTRAINT "FK_PostTags_Posts_PostId" FOREIGN KEY ("PostId") REFERENCES "Posts" ("PostId") ON DELETE CASCADE,
    CONSTRAINT "FK_PostTags_Tags_TagId" FOREIGN KEY ("TagId") REFERENCES "Tags" ("TagId") ON DELETE CASCADE
);

INSERT INTO "Users" ("UserId", "About", "Avatar", "Cover", "DisplayName", "Email", "Password", "Privacy", "Role", "Username", "UsersInfoId")
VALUES (1, 'Luis Carvalho', 'avatars/luis.jpg', 'covers/luis.jpg', 'Luis Carvalho', 'luiscarvalho239@gmail.com', '$2a$10$gkXD.CeFANpYcWPszE/Wv.goIQ.ueboXZOBRd/FktTsW9bs/0okhm', 0, 6, 'admin', 1);

INSERT INTO "Posts" ("PostId", "Content", "CreatedAt", "Image", "Slug", "Status", "Title", "UpdatedAt", "UserId")
VALUES (1, 'Welcome to LCPBlog!', TIMESTAMPTZ '2025-02-22T16:29:37.411456+00:00', 'blog.jpg', '/', 0, 'Welcome to LCPBlog!', TIMESTAMPTZ '2025-02-22T16:29:37.411484+00:00', 1);

CREATE INDEX "IX_Comments_PostId" ON "Comments" ("PostId");

CREATE INDEX "IX_Comments_UserId" ON "Comments" ("UserId");

CREATE INDEX "IX_PostCategories_CategoryId" ON "PostCategories" ("CategoryId");

CREATE INDEX "IX_Posts_UserId" ON "Posts" ("UserId");

CREATE INDEX "IX_PostTags_TagId" ON "PostTags" ("TagId");

CREATE INDEX "IX_RefreshToken_UserId" ON "RefreshToken" ("UserId");

SELECT setval(
    pg_get_serial_sequence('"Users"', 'UserId'),
    GREATEST(
        (SELECT MAX("UserId") FROM "Users") + 1,
        nextval(pg_get_serial_sequence('"Users"', 'UserId'))),
    false);
SELECT setval(
    pg_get_serial_sequence('"Posts"', 'PostId'),
    GREATEST(
        (SELECT MAX("PostId") FROM "Posts") + 1,
        nextval(pg_get_serial_sequence('"Posts"', 'PostId'))),
    false);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250222162938_InitialCreatePostgresSQL', '9.0.0');

COMMIT;

