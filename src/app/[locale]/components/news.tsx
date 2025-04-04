/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getImagePath, loadMyRealData } from "@applocale/functions/functions";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { Link } from '@/app/i18n/navigation';
import { Posts } from "@applocale/interfaces/posts";
import { User } from "@applocale/interfaces/user";
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import FetchDataAxios, { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/editor/myeditorpost";
import CarouselNews from "@applocale/components/carouselnews";
import MyPagination from "@applocale/components/mypagination";
import Views from "@applocale/components/views";
import LoadingComp from "@applocale/components/loadingcomp";

export default function News({ cid, pid, locale }: { cid: number, pid: number, locale: string }) {
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [counter, setCounter] = useState(0);
    const [hiddenViews, setHiddenViews] = useState(true);
    const enabledViews = true;
    const isEnabledMultiCols = true;
    const pageSize: number = 10;
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");

    const loadMyCounter = useCallback(() => {
        const pthpost = "/" + locale + "/pages/news/" + cid + "/" + pid;
        saveToStorage("hiddenViews", pathname == pthpost ? "false" : "true");
        setHiddenViews(getFromStorage("hiddenViews")! == "false" ? false : true);

        if(getFromStorage("viewsInfo")!) {
            setCounter(parseInt(""+JSON.parse(getFromStorage("viewsInfo")!).viewsCounter));
        }
    }, [cid, pid, locale, pathname]);

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

            if (newsdata) {
                setNews(JSON.parse(JSON.stringify(newsdata)));
            }

            if (usersdata) {
                setUsers(JSON.parse(JSON.stringify(usersdata)));
            }

            if (categories) {
                setCategories(JSON.parse(JSON.stringify(categories)));
            }

            setTotalPages(data[0].totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
            setLoading(false);
        }

        fetchNews();

        if (!loading) {
            loadMyRealData({ hubname: "datahub", skipNegotiation: false, fetchData: fetchNews });
            loadMyCounter();
        }
    }, [cid, pid, page, spage, counter, enabledViews, locale, pathname, loading, searchParams, loadMyCounter]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
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

    const setPathPost = (cid: number, pid: number) => {
        const qparamspost = parseInt("" + spage, 0) >= 0 ? "?page=" + parseInt("" + spage, 0) : "";
        const pthpost = "/" + locale + "/pages/news/" + cid + "/" + pid + qparamspost;
        saveToStorage("hiddenViews", pathname == pthpost ? "false" : "true");
        return pthpost;
    }

    const redirectToPost = async (e: any, newsi: Posts) => {
        e.preventDefault();
        const pthpost = setPathPost(newsi.categoryId, newsi.postId);
        const vinfopid = getFromStorage("viewsInfo")! ? JSON.parse(getFromStorage("viewsInfo")!).postId : 1;
        
        const data = {
            postId: newsi.postId,
            viewsCounter: parseInt(""+(newsi.viewsCounter!+1)),
            views: newsi.postId == vinfopid ? counter+1 : parseInt(""+(newsi.views!+1))
        };

        setCounter(parseInt(""+data.viewsCounter));
        setHiddenViews(getFromStorage("hiddenViews")! == "false" ? false : true);
        saveToStorage("viewsInfo", JSON.stringify(data));

        await FetchDataAxios({
            url: 'api/posts/views/'+data.postId,
            method: 'put',
            reqAuthorize: false,
            data: data
        }).then(x => {
            console.log(x);
            router.push(pthpost);
        }).catch(e => {
            console.error(e);
            router.push(pthpost);
        });
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
                                                <div className={"card-footer"}>
                                                    <div className="card-info">
                                                        <Views counter={counter} />
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
                    <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                        {!news || news.length == 0 && !!loading && getEmptyNews(pathname)}
                        {!!news && news.length > 0 && getContent()}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}