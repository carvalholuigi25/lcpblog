"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import { Posts } from "@applocale/interfaces/posts";
import { User } from "@applocale/interfaces/user";
import { Categories } from "@applocale/interfaces/categories";
import { getImagePath } from "@applocale/functions/functions";
import Footer from "@applocale/ui/footer";
import Header from "@applocale/ui/header";
import LoadingComp from "@applocale/components/loadingcomp";
import MyPagination from "@applocale/components/mypagination";

export default function Archive({ locale }: { locale: string }) {
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [totalComments, setTotalComments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [year, setYear] = useState(new Date().getFullYear());
    const yearlist = ["2025", "2026"];
    const pageSize: number = 10;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const t = useTranslations('ui.buttons');
    const spage = searchParams.get("page");

    useEffect(() => {
        async function fetchNews() {
            const curindex = page;
            const params = `?page=${curindex}&pageSize=${pageSize}`;

            const data = await FetchMultipleDataAxios([
                {
                    url: `api/posts${params}`,
                    method: 'get',
                    reqAuthorize: false
                },
                {
                    url: 'api/categories',
                    method: 'get',
                    reqAuthorize: false
                },
                {
                    url: 'api/users',
                    method: 'get',
                    reqAuthorize: false
                },
                {
                    url: `api/comments`,
                    method: 'get',
                    reqAuthorize: false
                }
            ]);

            const newsdata = year ? data[0].data.filter((x: any) => year == new Date(x.createdAt).getFullYear()) : data[0].data;
            const categories = data[1].data;
            const usersdata = data[2].data;
            const comments = data[3].data;

            if (newsdata) {
                setNews(JSON.parse(JSON.stringify(newsdata)));
            }

            if (usersdata) {
                setUsers(JSON.parse(JSON.stringify(usersdata)));
            }

            if (categories) {
                setCategories(JSON.parse(JSON.stringify(categories)));
            }

            if (comments) {
                setTotalComments(comments.length);
            }

            setTotalPages(data[0].totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
            setLoading(false);
        }

        fetchNews();
    }, [locale, pathname, loading, page, spage, year]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const getEmptyNews = (pathname: any): any => {
        return (
            <div className='col-12'>
                <div className="card p-3 text-center">
                    <div className='card-body'>
                        <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
                        <p>0 news</p>
                        {pathname !== "/" && (
                            <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>Back</Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const fetchNewsItems = (): any => {
        const items: any[] = [];

        users.map((useri) => {
            news.map((newsi, i) => {
                categories.map((categoryi) => {
                    if (newsi.userId == useri.userId) {
                        if (newsi.categoryId == categoryi.categoryId) {
                            items.push(
                                <div className={`col-12 mb-4`} key={"news" + i}>
                                    <div className={"card cardarch bshadow rounded"}>
                                        <div className="row justify-content-center align-items-center">
                                            <div className="col-md-6 col-lg-4">
                                                <Image
                                                    src={getImagePath(newsi.image)}
                                                    className="card-img-top rounded mx-auto d-block img-fluid"
                                                    width={800}
                                                    height={400}
                                                    alt={"blog image "}
                                                    priority
                                                />
                                            </div>
                                            <div className="col-md-6 col-lg-8">
                                                <div className={"card-body text-center"}>
                                                    <h5 className="card-title text-center mt-3">{newsi.title}</h5>
                                                    <div className={"card-author card-text mt-3"}>
                                                        <div className="container">
                                                            <div className="row justify-content-center align-items-center">
                                                                <div className="col-auto mt-3">
                                                                    <Image src={getImagePath(useri.avatar)} className="rounded img-fluid img-author" width={30} height={30} alt={useri.displayName + "'s avatar"} />
                                                                    <Link href={"/pages/users/" + newsi.userId} locale={locale ?? getDefLocale()} className="ms-2 txt-author">
                                                                        {useri.displayName}
                                                                    </Link>
                                                                </div>
                                                                <div className="col-auto mt-3">
                                                                    <i className="bi bi-clock icodate"></i>
                                                                    <span className="ms-2 txtdate" title={"" + newsi.createdAt}>
                                                                        {new Date(newsi.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <div className="col-auto mt-3">
                                                                    <i className="bi bi-bookmark"></i>
                                                                    <Link href={"/pages/news/" + newsi.categoryId} locale={locale ?? getDefLocale()} className="txtcategory ms-2" title={"Categoria: " + categoryi.name}>
                                                                        {categoryi.name}
                                                                    </Link>
                                                                </div>
                                                                <div className="col-auto mt-3">
                                                                    <i className="bi bi-chat icocomments"></i>
                                                                    <span className="numcomments ms-2">{totalComments}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card-footer mt-3">
                                                        <a href={`/pages/news/${newsi.categoryId}/${newsi.postId}`} className="btn btn-primary btn-rounded mx-auto d-inline-block">
                                                            {t("btnreadmore") ?? "Read more"}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    }
                });
            });
        });

        return items;
    };

    const onYearChange = (e: any) => {
        setYear(e.target.value);
        fetchNewsItems();
    }

    return (
        <div className={styles.page} id="marchivepage" style={{ paddingTop: '5rem' }}>
            <Header locale={locale ?? getDefLocale()} />
            <section>
                <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h3 className="title mt-3 mb-3">
                                    <i className="bi bi-archive"></i>
                                    <span className="ms-2">Archive</span>
                                </h3>
                                
                                <select defaultValue={2025} className="form-control mt-3 mb-3" onChange={onYearChange}>
                                    {yearlist.map(y => (
                                        <option value={y} key={y}>{y}</option>
                                    ))}
                                </select>

                                {!news || news.length == 0 && getEmptyNews(pathname)}
                                {!!news && news.length > 0 && fetchNewsItems()}
                                <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                            </div>
                        </div>
                    </div>
                </Suspense>
            </section>
            <Footer />
        </div>
    )
}