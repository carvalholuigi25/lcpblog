IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Categories] (
    [CategoryId] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [CreatedAt] datetimeoffset NULL,
    [UpdatedAt] datetimeoffset NULL,
    [Status] int NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([CategoryId])
);

CREATE TABLE [FilesMetadata] (
    [Id] int NOT NULL IDENTITY,
    [gId] uniqueidentifier NOT NULL,
    [FileName] nvarchar(max) NOT NULL,
    [FilePath] nvarchar(max) NOT NULL,
    [ContentType] nvarchar(max) NULL,
    [UploadedAt] datetimeoffset NULL,
    CONSTRAINT [PK_FilesMetadata] PRIMARY KEY ([Id])
);

CREATE TABLE [Tags] (
    [TagId] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NULL,
    [CreatedAt] datetimeoffset NULL,
    [UpdatedAt] datetimeoffset NULL,
    [Status] int NULL,
    CONSTRAINT [PK_Tags] PRIMARY KEY ([TagId])
);

CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [Username] nvarchar(max) NOT NULL,
    [Password] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NULL,
    [DisplayName] nvarchar(max) NULL,
    [Avatar] nvarchar(max) NULL,
    [Cover] nvarchar(max) NULL,
    [About] nvarchar(max) NULL,
    [Role] int NULL,
    [Privacy] int NULL,
    [UsersInfoId] int NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
);

CREATE TABLE [Posts] (
    [PostId] int NOT NULL IDENTITY,
    [Title] nvarchar(max) NULL,
    [Content] nvarchar(max) NULL,
    [Image] nvarchar(max) NULL,
    [Slug] nvarchar(max) NULL,
    [CreatedAt] datetimeoffset NULL,
    [UpdatedAt] datetimeoffset NULL,
    [Status] int NULL,
    [UserId] int NULL,
    CONSTRAINT [PK_Posts] PRIMARY KEY ([PostId]),
    CONSTRAINT [FK_Posts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
);

CREATE TABLE [RefreshToken] (
    [Id] int NOT NULL IDENTITY,
    [Token] nvarchar(max) NOT NULL,
    [Expires] datetimeoffset NOT NULL,
    [Created] datetimeoffset NOT NULL,
    [CreatedByIp] nvarchar(max) NOT NULL,
    [Revoked] datetimeoffset NULL,
    [RevokedByIp] nvarchar(max) NOT NULL,
    [ReplacedByToken] nvarchar(max) NOT NULL,
    [ReasonRevoked] nvarchar(max) NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_RefreshToken] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RefreshToken_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
);

CREATE TABLE [Comments] (
    [CommentId] int NOT NULL IDENTITY,
    [Content] nvarchar(max) NULL,
    [CreatedAt] datetimeoffset NULL,
    [UpdatedAt] datetimeoffset NULL,
    [Status] int NULL,
    [UserId] int NULL,
    [PostId] int NULL,
    CONSTRAINT [PK_Comments] PRIMARY KEY ([CommentId]),
    CONSTRAINT [FK_Comments_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([PostId]),
    CONSTRAINT [FK_Comments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
);

CREATE TABLE [PostCategories] (
    [PostId] int NOT NULL,
    [CategoryId] int NOT NULL,
    CONSTRAINT [PK_PostCategories] PRIMARY KEY ([PostId], [CategoryId]),
    CONSTRAINT [FK_PostCategories_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([CategoryId]) ON DELETE CASCADE,
    CONSTRAINT [FK_PostCategories_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([PostId]) ON DELETE CASCADE
);

CREATE TABLE [PostTags] (
    [PostId] int NOT NULL,
    [TagId] int NOT NULL,
    CONSTRAINT [PK_PostTags] PRIMARY KEY ([PostId], [TagId]),
    CONSTRAINT [FK_PostTags_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([PostId]) ON DELETE CASCADE,
    CONSTRAINT [FK_PostTags_Tags_TagId] FOREIGN KEY ([TagId]) REFERENCES [Tags] ([TagId]) ON DELETE CASCADE
);

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'About', N'Avatar', N'Cover', N'DisplayName', N'Email', N'Password', N'Privacy', N'Role', N'Username', N'UsersInfoId') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] ON;
INSERT INTO [Users] ([UserId], [About], [Avatar], [Cover], [DisplayName], [Email], [Password], [Privacy], [Role], [Username], [UsersInfoId])
VALUES (1, N'Luis Carvalho', N'avatars/luis.jpg', N'covers/luis.jpg', N'Luis Carvalho', N'luiscarvalho239@gmail.com', N'$2a$10$mXtC305.hkCDpJxsqUd.4upZYJZD6VrCz698O75DliuC4OK3nWC0i', 0, 6, N'admin', 1);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'About', N'Avatar', N'Cover', N'DisplayName', N'Email', N'Password', N'Privacy', N'Role', N'Username', N'UsersInfoId') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PostId', N'Content', N'CreatedAt', N'Image', N'Slug', N'Status', N'Title', N'UpdatedAt', N'UserId') AND [object_id] = OBJECT_ID(N'[Posts]'))
    SET IDENTITY_INSERT [Posts] ON;
INSERT INTO [Posts] ([PostId], [Content], [CreatedAt], [Image], [Slug], [Status], [Title], [UpdatedAt], [UserId])
VALUES (1, N'Welcome to LCPBlog!', '2025-02-22T16:26:48.4501653+00:00', N'blog.jpg', N'/', 0, N'Welcome to LCPBlog!', '2025-02-22T16:26:48.4501960+00:00', 1);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PostId', N'Content', N'CreatedAt', N'Image', N'Slug', N'Status', N'Title', N'UpdatedAt', N'UserId') AND [object_id] = OBJECT_ID(N'[Posts]'))
    SET IDENTITY_INSERT [Posts] OFF;

CREATE INDEX [IX_Comments_PostId] ON [Comments] ([PostId]);

CREATE INDEX [IX_Comments_UserId] ON [Comments] ([UserId]);

CREATE INDEX [IX_PostCategories_CategoryId] ON [PostCategories] ([CategoryId]);

CREATE INDEX [IX_Posts_UserId] ON [Posts] ([UserId]);

CREATE INDEX [IX_PostTags_TagId] ON [PostTags] ([TagId]);

CREATE INDEX [IX_RefreshToken_UserId] ON [RefreshToken] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250222162649_InitialCreateSQLServer', N'9.0.0');

COMMIT;
GO

