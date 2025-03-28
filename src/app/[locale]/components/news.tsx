/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/app/i18n/navigation';
import { Posts } from "@applocale/interfaces/posts";
import { User } from "@applocale/interfaces/user";
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { getImagePath, loadMyRealData, shortenLargeNumber } from "@applocale/functions/functions";
import MyEditorPost from "@applocale/components/editor/myeditorpost";
import CarouselNews from "@applocale/components/carouselnews";
import MyPagination from "@applocale/components/mypagination";

export default function News({ cid, pid, locale }: { cid: number, pid: number, locale: string }) {
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [views, setViews] = useState(0);
    const [enabledViews, setEnabledViews] = useState(false);
    const [hiddenViews, setHiddenViews] = useState(true);
    const isEnabledMultiCols = true;
    const pageSize: number = 10;
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");

    const loadViewerCounter = useCallback(() => {
        if(!!enabledViews) {
            const counter = getFromStorage("viewsInfo")! ? JSON.parse(getFromStorage("viewsInfo")!).views : 0;

            if(cid != -1 && pid != -1 && pathname == "/"+locale+"/pages/news/" + cid + "/" + pid) {
                setHiddenViews(false);
            }

            if(!!enabledViews && !views) {
                const uid = getFromStorage("logInfo")! ? JSON.parse(getFromStorage("logInfo")!)[0].id : -1;
                const actualpid = getFromStorage("viewsInfo")! ? JSON.parse(getFromStorage("viewsInfo")!).pid : 1;

                setViews(pid == actualpid ? counter-1+1 : 1);
                saveToStorage("viewsInfo", JSON.stringify({ pid: pid, cid: cid, userId: uid, views: counter+1 }));
            }
        }
    }, [cid, enabledViews, views, pid, pathname, locale]);

    useEffect(() => {
        async function fetchNews() {
            const curindex = pageSize == 1 ? (page > pid ? page : pid) : page;
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
                }
            ]);

            const newsdata = cid > -1 && pid > -1 ? data[0].data.filter((item: Posts) => item.categoryId == cid && item.postId == pid) : cid > -1 ? data[0].data.filter((item: Posts) => item.categoryId == cid) : data[0].data;
            const categories = cid > -1 ? data[1].data.filter((item: Categories) => item.categoryId == cid) : data[1].data;
            const usersdata = data[2].data;

            if(newsdata) {
                setNews(JSON.parse(JSON.stringify(newsdata)));
            }

            if(usersdata) {
                setUsers(JSON.parse(JSON.stringify(usersdata)));
            }

            if(categories) {
                setCategories(JSON.parse(JSON.stringify(categories)));
            }

            setTotalPages(data[0].totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
            setLoading(false);
        }

        fetchNews();

        if(!loading) {
            loadMyRealData({ hubname: "datahub", skipNegotiation: false, fetchData: fetchNews });
            loadViewerCounter();
        }
    }, [cid, pid, page, spage, views, enabledViews, locale, pathname, loading, searchParams, loadViewerCounter]);

    if (loading) {
        return (
            <div className='container'>
                <div className='row justify-content-center align-items-center p-3'>
                    <div className='col-12 card p-3 text-center'>
                        <div className='card-body'>
                            <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getMultiCols = (i: number, isMulticolsEnabled: boolean) => {
        const cols = i == 0 ? 12 : i >= 1 && i <= 2 ? 6 : 4;
        const fcol = 12;
        return isMulticolsEnabled ? (cid != -1 ? (pid != -1 ? (i <= 1 ? fcol : cols) : cols) : cols) : fcol;
    };

    const getFeaturedItem = (i: number) => {
        return i == 0 ? (
            <div className="card-info-featured-wrapper">
                <div className="card-info-featured">
                    <i className="bi bi-star-fill"></i>
                </div>
            </div>
        ) : "";
    };

    const redirectToPost = async (e: any, newsi: Posts) => {
        e.preventDefault();
        const qparamspost = parseInt(""+spage, 0) >= 0 ? "?page=" + parseInt(""+spage, 0) : "";
        const pthpost = "/" + locale + "/pages/news/" + newsi.categoryId + "/" + newsi.postId + qparamspost;
        
        if(!!enabledViews) {
            const uid = getFromStorage("logInfo")! ? JSON.parse(getFromStorage("logInfo")!)[0].id : -1;
            saveToStorage("viewsInfo", JSON.stringify({ pid: newsi.postId, cid: newsi.categoryId, userId: uid, views: views }));
            setEnabledViews(true);
            setHiddenViews(pathname == pthpost ? false : true);
        }

        router.push(pthpost);
    };

    const fetchNewsItems = (): any => {
        const items: any[] = [];

        users.map((useri) => {
            news.map((newsi, i) => {
                categories.map((categoryi) => {
                    if (newsi.userId == useri.userId) {
                        if (newsi.categoryId == categoryi.categoryId) {
                            items.push(
                                <div className={`col-12 col-sm-6 col-md-${getMultiCols(i, isEnabledMultiCols)} col-lg-${getMultiCols(i, isEnabledMultiCols)} col-xl-${getMultiCols(i, isEnabledMultiCols)} mb-4`} key={"news" + i}>
                                    {cid > -1 && pid == -1 && (
                                        <div className="col-12 text-center mb-3" key={"category" + i}>
                                            <h2 className="txtcategory">{categoryi.name}</h2>
                                        </div>
                                    )}

                                    <div className="card cardnews shadow rounded">
                                        <Image
                                            src={getImagePath(newsi.image)}
                                            className="card-img-top rounded mx-auto d-block img-fluid"
                                            width={800}
                                            height={400}
                                            alt={"blog image "}
                                            priority
                                        />

                                        <div className="card-body text-center">
                                            <div className="card-info">
                                                <div className="card-author card-text">
                                                    {getFeaturedItem(i)}
                                                    <Image src={getImagePath(useri.avatar)} className="rounded img-fluid img-author" width={30} height={30} alt={useri.displayName + "'s avatar"} />
                                                    <Link href={"/pages/users/" + newsi.userId} locale={locale ?? getDefLocale()} className="txt-author">
                                                        {useri.displayName}
                                                    </Link>
                                                    <span className="linesep"></span>
                                                    <i className="bi bi-clock icodate"></i>
                                                    <span className="ms-2 txtdate" title={"" + newsi.createdAt}>
                                                        {new Date(newsi.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}
                                                    </span>

                                                    {cid != -1 && (
                                                        <>
                                                            <span className="linesep"></span>
                                                            <i className="bi bi-bookmark"></i>
                                                            <Link href={"/pages/news/" + newsi.categoryId} locale={locale ?? getDefLocale()} className="txtcategory ms-2" title={"Categoria: " + categoryi.name}>
                                                                {categoryi.name}
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <h5 className="card-title text-center">{newsi.title}</h5>

                                            {pid != -1 && (
                                                <MyEditorPost value={newsi.content} editable={false} onChange={() => { }} />
                                            )}

                                            {pid == -1 && (
                                                <button className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" onClick={(e: any) => redirectToPost(e, newsi)}>Read more</button>
                                            )}

                                            {!!enabledViews && !hiddenViews && (
                                                <div className="card-footer">
                                                    <div className="card-info">
                                                        <i className="bi bi-eye"></i>
                                                        <span className="txtviews">{"Views: " + shortenLargeNumber(views, 1)}</span>
                                                    </div>
                                                </div>
                                            )}
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

    const getBackLink = (pathname: any): any => {
        return (
            <div className="col-12 mt-3 mx-auto text-center">
                <Link href={pathname !== "/pages/news" ? "../" : "/"} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block">
                    Back
                </Link>
            </div>
        );
    };

    const getContent = () => {
        return (
            <>
                {fetchNewsItems()}
                <MyPagination cid={cid} pid={pid} currentPage={page} totalPages={totalPages} />
                {pathname !== "/" || pathname !== "/" + getDefLocale() && getBackLink(pathname)}
            </>
        );
    }

    return (
        <div className={styles.page}>
            <CarouselNews news={news} pathname={pathname} locale={locale ?? getDefLocale()} />

            <div className="container">
                <div className="row justify-content-center align-items-center mt-5 mb-5">
                    {!news || news.length == 0 && getEmptyNews(pathname)}
                    {!!news && news.length > 0 && getContent()}
                </div>
            </div>
        </div>
    );
}