"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/app/i18n/navigation";
import { User } from "@applocale/interfaces/user";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { FetchMultipleData } from "@applocale/utils/fetchdata";
import { getImagePath } from "@applocale/functions/functions";
import { useMySuffix } from "@applocale/hooks/suffixes";
import { Posts } from "@applocale/interfaces/posts";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import LoadingComp from "@/app/[locale]/components/ui/loadingcomp";
import MyPagination from "@/app/[locale]/components/ui/mypagination";

export default function UserPage() {
  const t = useTranslations("pages.UsersPage");
  const newsSuffix = useMySuffix("news");

  const locale = useLocale();
  const { id } = useParams();
  const [users, setUsers] = useState(null as unknown as User);
  const [news, setNews] = useState([] as Posts[]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize: number = 10;

  const searchParams = useSearchParams();
  const spage = searchParams.get("page");

  useEffect(() => {
    async function fetchUsers() {
      const curindex =
        pageSize == 1
          ? page > parseInt("" + id, 0)
            ? page
            : parseInt("" + id, 0)
          : page;
      const params = `?page=${curindex}&pageSize=${pageSize}`;
      const idq = id !== "" ? "/" + parseInt("" + id, 0) : "/";
      const data = await FetchMultipleData([
        {
          url: `api/users${idq}`,
          method: "get",
          reqAuthorize: true,
        },
        {
          url: `api/posts/users${idq}${params}`,
          method: "get",
          reqAuthorize: true,
        },
      ]);

      if (data[0]) {
        setUsers(JSON.parse(JSON.stringify(data[0])));
      }

      if (data[1]) {
        setNews(JSON.parse(JSON.stringify(data[1].data)));
      }

      setTotalPages(data[1].totalPages);
      setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
      setIsLoading(false);
    }

    fetchUsers();
  }, [id, isLoading, page, spage]);

  if (!users || isLoading) {
    return <LoadingComp type="icon" icontype="ring" />;
  }

  const getFeaturedItem = (i: number) => {
    return i == 0 ? (
      <div className="card-info-featured-wrapper">
        <div className="card-info-featured">
          <i className="bi bi-star-fill"></i>
        </div>
      </div>
    ) : (
      ""
    );
  };

  return (
    <>
      <Header locale={locale ?? getDefLocale()} />
      <div
        className="container"
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        {!users.userId && (
          <div className="row justify-content-center align-items-center p-3">
            <div className="col-12 card p-3 text-center">
              <div className="card-body">
                <i
                  className="bi-exclamation-triangle"
                  style={{ fontSize: "4rem" }}
                ></i>
                <p>
                  {t("usernotfound") ??
                    "User not found or you dont have permissions to view this page!"}
                </p>
                <Link
                  className="btn btn-primary btn-rounded card-btn mt-3"
                  href={`/pages/users`}
                  locale={locale ?? getDefLocale()}
                >
                  {t("btnback") ?? "Back"}
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="row justify-content-center align-items-center p-3">
          {!!users.userId && (
            <div className="col-12 p-3 text-center" key={users.userId}>
              <div className="card bcuserinfo">
                <div className="cardwrapper">
                  <Image
                    src={"/images/" + (users.cover ?? "default.jpg")}
                    width={1200}
                    height={300}
                    alt={
                      t("covertitle", { displayName: users.displayName }) ??
                      users.displayName + "'s Cover"
                    }
                    className={styles.userinfocover}
                    priority
                  />
                  <Image
                    src={"/images/" + (users.avatar ?? "guest.png")}
                    width={100}
                    height={100}
                    alt={
                      t("avatartitle", { displayName: users.displayName }) ??
                      users.displayName + "'s Avatar"
                    }
                    className={styles.userinfoavatar + " bcavatar"}
                  />
                </div>

                <div className="card-body p-3 mt-4">
                  <div className="card-text pt-3 pb-0 ps-0 pe-0">
                    <h3 className="card-title">{users.displayName}</h3>

                    <ul
                      className="nav nav-tabs justify-content-center"
                      id="usersinfoTab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="posts-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#posts-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="posts-tab-pane"
                          aria-selected="true"
                        >
                          {t("display.lblposts") ?? "Posts"}
                          <span className="badge text-bg-secondary ms-2 rounded-circle">
                            {news.length ?? 0}
                          </span>
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="profile-tab-pane"
                          aria-selected="false"
                        >
                          {t("display.lblprofile") ?? "Profile"}
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content" id="usersinfoTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="posts-tab-pane"
                        role="tabpanel"
                        aria-labelledby="posts-tab"
                        tabIndex={0}
                      >
                        <div className="container-fluid mt-3">
                          <div className="row justify-content-center align-items-center">
                            {news.length > 0 ? (
                              <>
                                {news.map((post, i) => (
                                  <div
                                    key={post.postId}
                                    className="col-12 col-sm-12 col-md-6 col-lg-4"
                                  >
                                    <div className="card cardnews bshadow rounded mb-3">
                                      <div className="card-sbody text-center">
                                        {getFeaturedItem(i)}
                                        <Image
                                          src={getImagePath(post.image)}
                                          className="card-img-top rounded mx-auto d-block img-fluid"
                                          width={800}
                                          height={400}
                                          alt={"blog image "}
                                          priority
                                        />
                                        <div className="card-text p-3">
                                          <h5 className="card-title mt-3">
                                            {post.title}
                                          </h5>

                                          <div className="row justify-content-center align-items-center mt-3">
                                            <div className="col-auto">
                                              <div className="postdate">
                                                <i className="bi bi-clock icodate"></i>
                                                <span
                                                  className="ms-2 txtdate"
                                                  title={"" + post.createdAt}
                                                >
                                                  {new Date(
                                                    post.createdAt
                                                  ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                      year: "numeric",
                                                      month: "2-digit",
                                                      day: "2-digit",
                                                      weekday: undefined,
                                                      hour: "2-digit",
                                                      hour12: false,
                                                      minute: "2-digit",
                                                      second: "2-digit",
                                                    }
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="col-auto">
                                              <div className="postviews">
                                                <i className="bi bi-eye icoviews"></i>
                                                <span className="ms-2 txtviews">
                                                  {post.views}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <Link
                                            href={`/${newsSuffix}/${post.categoryId}/${post.postId}`}
                                            locale={locale ?? getDefLocale()}
                                            className="btn btn-primary mt-3"
                                          >
                                            {t("display.btnreadmore") ??
                                              "Read more"}
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <MyPagination
                                  cid={-1}
                                  pid={-1}
                                  currentPage={page}
                                  totalPages={totalPages}
                                />
                              </>
                            ) : (
                              <div className="col-12">
                                <i className="bi bi-exclamation-warning"></i>
                                <p className="mt-3 mx-auto text-center">
                                  {t("display.lblnoposts") ??
                                    "No posts available for this user. Please check back later!"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="profile-tab-pane"
                        role="tabpanel"
                        aria-labelledby="profile-tab"
                        tabIndex={0}
                      >
                        <div className="textfrm">
                          <p>
                            {t("display.lbluserid") ?? "User Id"} {users.userId}
                          </p>
                          <p>
                            {t("display.lblusername") ?? "Username"}{" "}
                            {users.username}
                          </p>
                          <p>
                            {t("display.lbldisplayname") ?? "Display name"}{" "}
                            {users.displayName}
                          </p>
                          <p>
                            {t("display.lblabout") ?? "About"}{" "}
                            {users.about ?? "N/A"}
                          </p>

                          <div className="contactinfo mt-3">
                            <p>{t("display.lblcontact") ?? "Contact?"}</p>
                            <a
                              href={`mailto:${users.email}`}
                              className="btn btn-tp btnsendmail btn-rounded"
                            >
                              <i className="bi bi-envelope-fill"></i>{" "}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-12 mx-auto text-center">
            <Link
              className="btn btn-primary btn-rounded card-btn mt-3"
              href={"/pages/users"}
              locale={locale ?? getDefLocale()}
            >
              {t("btnback") ?? "Back"}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
