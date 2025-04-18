﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using lcpblogapi.Context;

#nullable disable

namespace lcpblogapi.Migrations.SQLite
{
    [DbContext(typeof(MyDBContextSQLite))]
    partial class MyDBContextSQLiteModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("lcpblogapi.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Slug")
                        .HasColumnType("TEXT");

                    b.Property<int?>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");

                    b.HasData(
                        new
                        {
                            CategoryId = 1,
                            CreatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(9303), new TimeSpan(0, 1, 0, 0, 0)),
                            Name = "Geral",
                            Slug = "/geral",
                            Status = 0,
                            UpdatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(9584), new TimeSpan(0, 1, 0, 0, 0))
                        },
                        new
                        {
                            CategoryId = 2,
                            CreatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(9855), new TimeSpan(0, 1, 0, 0, 0)),
                            Name = "Tecnologia",
                            Slug = "/tecnologia",
                            Status = 0,
                            UpdatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(9858), new TimeSpan(0, 1, 0, 0, 0))
                        },
                        new
                        {
                            CategoryId = 3,
                            CreatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(9865), new TimeSpan(0, 1, 0, 0, 0)),
                            Name = "Outros",
                            Slug = "/outros",
                            Status = 0,
                            UpdatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(9867), new TimeSpan(0, 1, 0, 0, 0))
                        });
                });

            modelBuilder.Entity("lcpblogapi.Models.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<DateTimeOffset?>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<int?>("PostId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("CommentId");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("lcpblogapi.Models.FileMetadata", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ContentType")
                        .HasColumnType("TEXT");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTimeOffset?>("UploadedAt")
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("gId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("FilesMetadata");
                });

            modelBuilder.Entity("lcpblogapi.Models.Post", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<DateTimeOffset?>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Image")
                        .HasColumnType("TEXT");

                    b.Property<string>("Slug")
                        .HasColumnType("TEXT");

                    b.Property<int?>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.Property<DateTimeOffset?>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.Property<int?>("UserId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Views")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ViewsCounter")
                        .HasColumnType("INTEGER");

                    b.HasKey("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("Posts");

                    b.HasData(
                        new
                        {
                            PostId = 1,
                            CategoryId = 1,
                            Content = "Welcome to LCPBlog!",
                            CreatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(2457), new TimeSpan(0, 1, 0, 0, 0)),
                            Image = "blog.jpg",
                            Slug = "/",
                            Status = 0,
                            Title = "Welcome to LCPBlog!",
                            UpdatedAt = new DateTimeOffset(new DateTime(2025, 4, 8, 14, 30, 49, 365, DateTimeKind.Unspecified).AddTicks(2741), new TimeSpan(0, 1, 0, 0, 0)),
                            UserId = 1,
                            Views = 0,
                            ViewsCounter = 0
                        });
                });

            modelBuilder.Entity("lcpblogapi.Models.PostCategory", b =>
                {
                    b.Property<int>("PostId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CategoryId")
                        .HasColumnType("INTEGER");

                    b.HasKey("PostId", "CategoryId");

                    b.HasIndex("CategoryId");

                    b.ToTable("PostCategories");
                });

            modelBuilder.Entity("lcpblogapi.Models.PostTag", b =>
                {
                    b.Property<int>("PostId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TagId")
                        .HasColumnType("INTEGER");

                    b.HasKey("PostId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("PostTags");
                });

            modelBuilder.Entity("lcpblogapi.Models.Schedules", b =>
                {
                    b.Property<int>("ScheduleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool?>("AllDay")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DateEnd")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateStart")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ScheduleId");

                    b.ToTable("Schedule");
                });

            modelBuilder.Entity("lcpblogapi.Models.Tag", b =>
                {
                    b.Property<int>("TagId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int?>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset?>("UpdatedAt")
                        .HasColumnType("TEXT");

                    b.HasKey("TagId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("lcpblogapi.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("About")
                        .HasColumnType("TEXT");

                    b.Property<string>("Avatar")
                        .HasColumnType("TEXT");

                    b.Property<string>("Cover")
                        .HasColumnType("TEXT");

                    b.Property<string>("DisplayName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("Privacy")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Role")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("UsersInfoId")
                        .HasColumnType("INTEGER");

                    b.HasKey("UserId");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            UserId = 1,
                            About = "Luis Carvalho",
                            Avatar = "avatars/luis.jpg",
                            Cover = "covers/luis.jpg",
                            DisplayName = "Luis Carvalho",
                            Email = "luiscarvalho239@gmail.com",
                            Password = "$2a$10$b4l3vOTFk18J29oxY3h1O.CMdhFNIRs7e6J7cd.rWk.34toJyo0uS",
                            Privacy = 0,
                            Role = 6,
                            Username = "admin",
                            UsersInfoId = 1
                        });
                });

            modelBuilder.Entity("lcpblogapi.Models.Comment", b =>
                {
                    b.HasOne("lcpblogapi.Models.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId");

                    b.HasOne("lcpblogapi.Models.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserId");

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("lcpblogapi.Models.Post", b =>
                {
                    b.HasOne("lcpblogapi.Models.User", "User")
                        .WithMany("Posts")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("lcpblogapi.Models.PostCategory", b =>
                {
                    b.HasOne("lcpblogapi.Models.Category", "Category")
                        .WithMany("PostCategories")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("lcpblogapi.Models.Post", "Post")
                        .WithMany("PostCategories")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Post");
                });

            modelBuilder.Entity("lcpblogapi.Models.PostTag", b =>
                {
                    b.HasOne("lcpblogapi.Models.Post", "Post")
                        .WithMany("PostTags")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("lcpblogapi.Models.Tag", "Tag")
                        .WithMany("PostTags")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("lcpblogapi.Models.User", b =>
                {
                    b.OwnsMany("lcpblogapi.Models.UsersAuth.RefreshToken", "RefreshTokens", b1 =>
                        {
                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("INTEGER");

                            b1.Property<DateTime>("Created")
                                .HasColumnType("TEXT");

                            b1.Property<string>("CreatedByIp")
                                .IsRequired()
                                .HasColumnType("TEXT");

                            b1.Property<DateTime>("Expires")
                                .HasColumnType("TEXT");

                            b1.Property<string>("ReasonRevoked")
                                .IsRequired()
                                .HasColumnType("TEXT");

                            b1.Property<string>("ReplacedByToken")
                                .IsRequired()
                                .HasColumnType("TEXT");

                            b1.Property<DateTime?>("Revoked")
                                .HasColumnType("TEXT");

                            b1.Property<string>("RevokedByIp")
                                .IsRequired()
                                .HasColumnType("TEXT");

                            b1.Property<string>("Token")
                                .IsRequired()
                                .HasColumnType("TEXT");

                            b1.Property<int>("UserId")
                                .HasColumnType("INTEGER");

                            b1.HasKey("Id");

                            b1.HasIndex("UserId");

                            b1.ToTable("RefreshToken");

                            b1.WithOwner()
                                .HasForeignKey("UserId");
                        });

                    b.Navigation("RefreshTokens");
                });

            modelBuilder.Entity("lcpblogapi.Models.Category", b =>
                {
                    b.Navigation("PostCategories");
                });

            modelBuilder.Entity("lcpblogapi.Models.Post", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("PostCategories");

                    b.Navigation("PostTags");
                });

            modelBuilder.Entity("lcpblogapi.Models.Tag", b =>
                {
                    b.Navigation("PostTags");
                });

            modelBuilder.Entity("lcpblogapi.Models.User", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Posts");
                });
#pragma warning restore 612, 618
        }
    }
}
