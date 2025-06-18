/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatDate, getImagePath, loadMyRealData } from "@applocale/functions/functions";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { useTranslations } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { Posts, PostsViews } from "@applocale/interfaces/posts";
import { User } from "@applocale/interfaces/user";
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useMySuffix } from "@applocale/hooks/suffixes";
import { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import { updateDataViews } from "@applocale/utils/data/updateDataViews";
import MyEditorPost from "@applocale/components/ui/editor/myeditorpost";
import CarouselNews from "@applocale/components/ui/carouselnews";
import MyPagination from "@applocale/components/ui/mypagination";
import Views from "@applocale/components/ui/views";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import Comments from "@applocale/components/ui/comments";

export interface NewsProps {
    cid: number;
    pid: number;
    tagname?: string;
    locale?: string;
}

export default function News({ cid, pid, tagname, locale }: NewsProps) {
    const t = useTranslations("pages.NewsPage");
    const tbtn = useTranslations("ui.buttons");
    const newsSuffix = useMySuffix("news");
    const tagsNewsSuffix = useMySuffix("tagsNews");

    const enabledViews = true;
    const isAutoUpdateViewsEnabled = true;
    const isEnabledMultiCols = true;
    const pageSize: number = 10;
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [counter, setCounter] = useState(0);
    const [hiddenViews, setHiddenViews] = useState(true);
    const [myEditorKey, setMyEditorKey] = useState(new Date().toString());
    const [isCommentFormShown, setIsCommentFormShown] = useState(false);
    const [totalComments, setTotalComments] = useState(0);
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");

    const loadMyCounter = useCallback(() => {
        const pthpost = `/${locale}/${newsSuffix}/${cid}/${pid}`;
        saveToStorage("hiddenViews", pathname == pthpost ? "false" : "true");
        setHiddenViews(getFromStorage("hiddenViews")! == "false" ? false : true);
        setCounter(getFromStorage("viewsInfo")! ? parseInt(JSON.parse(getFromStorage("viewsInfo")!).viewsCounter) : 0);
    }, [locale, cid, pid, newsSuffix, pathname]);

    const loadAutoViews = useCallback(async () => {
        if(isAutoUpdateViewsEnabled) {
            if(cid >= 1 && pid >= 1) {
                if(new Date().getHours() >= 0 && new Date().getHours() <= 23) {
                    console.log("Auto Update Views is enabled!");

                    const id = setInterval(async () => {
                        const inc = counter + 1;
                        setCounter(inc);

                        const data: PostsViews = {
                            postId: pid,
                            viewsCounter: parseInt("" + inc),
                            views: parseInt("" + inc)
                        };

                        saveToStorage("viewsInfo", JSON.stringify(data));

                        await updateDataViews(data).then(x => {
                            console.log(x);
                        }).catch(e => {
                            console.error(e);
                        });
                    }, 1000 * 60 * 60 * 24); //86400000 miliseconds = 1 hour

                    return () => {
                        clearInterval(id);
                    }
                }
            }
        } else {
            console.log("Auto Update Views is disabled!");
        }
    }, [cid, counter, isAutoUpdateViewsEnabled, pid]);

    useEffect(() => {
        async function fetchNews() {
            const curindex = pageSize == 1 ? (page > pid ? page : pid) : page;
            const params = `?page=${curindex}&pageSize=${pageSize}&sortBy=postfeat&sortOrder=desc`;

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
                    url: `api/comments/posts/${pid}`,
                    method: 'get',
                    reqAuthorize: false
                }
            ]);

            const newsdata = cid > -1 && pid > -1 ? data[0].data.filter((item: Posts) => item.categoryId == cid && item.postId == pid) : cid > -1 ? (tagname ? data[0].data.filter((i: Posts) => i.tags?.includes("#"+tagname)) : data[0].data.filter((item: Posts) => item.categoryId == cid)) : data[0].data;
            const categories = cid > -1 ? data[1].data.filter((item: Categories) => item.categoryId == cid) : data[1].data;
            const usersdata = data[2].data;
            const comments = data[3];

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
            setMyEditorKey(Date.now().toString());
            loadMyCounter();
            setLoading(false);
        }

        fetchNews();

        if(!loading) {
            loadMyRealData({ hubname: "datahub", skipNegotiation: false, fetchData: fetchNews });            
            loadAutoViews();
        }
    }, [cid, pid, page, spage, enabledViews, locale, pathname, loading, searchParams, loadMyCounter, loadAutoViews, tagname]);

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

    const getPathPost = (cid: number, pid: number) => {
        const qparamspost = parseInt("" + spage, 0) >= 0 ? `?page=${parseInt("" + spage, 0)}` : "";
        const pthpost = `/${locale}/${newsSuffix}/${cid}/${pid}${qparamspost}`;
        return pthpost;
    }

    const redirectToPost = async (e: any, newsi: Posts) => {
        e.preventDefault();
        const pthpost = getPathPost(newsi.categoryId, newsi.postId);

        const data: PostsViews = {
            postId: newsi.postId,
            viewsCounter: parseInt("" + (newsi.viewsCounter! + 1)),
            views: parseInt("" + (newsi.viewsCounter! + 1))
        };

        setCounter(parseInt("" + data.viewsCounter));
        setHiddenViews(getFromStorage("hiddenViews")! == "false" ? false : true);
        saveToStorage("hiddenViews", pathname == pthpost ? "false" : "true");
        saveToStorage("viewsInfo", JSON.stringify(data));

        await updateDataViews(data).then(x => {
            console.log(x);
            router.push(pthpost);
        }).catch(e => {
            console.error(e);
            router.push(pthpost);
        });
    };

    const toggleComments = () => {
        return setIsCommentFormShown(!isCommentFormShown);
    }

    const fetchNewsItems = (): any => {
        const items: any[] = [];

        users.map((useri) => {
            news.map((newsi, i) => {
                categories.map((categoryi) => {
                    if (newsi.userId == useri.userId) {
                        if (newsi.categoryId == categoryi.categoryId) {
                            const cardgradient = () => {
                                return !pathname.includes(`/${newsSuffix}/${newsi.categoryId}/${newsi.postId}`) ? "cardlg" : "";
                            };

                            const tagorcatname = i == 0 && cid > -1 && pid == -1 && (
                                <div className="col-12 text-center mb-3" key={tagname && pathname.includes(`/${tagsNewsSuffix}/${newsi.categoryId}/${tagname}`) ? `tag${i}` : `category${i}`}>
                                    {tagname && pathname.includes(`/${tagsNewsSuffix}/${newsi.categoryId}/${tagname}`) ? (
                                        <h2 className="txttagname">{"#" + tagname}</h2>
                                    ) : (
                                        <h2 className="txtcategory">{categoryi.name}</h2>
                                    )}
                                </div>
                            );

                            const ncols = getMultiCols(i, isEnabledMultiCols);

                            items.push(
                                <div className={`col-12 col-sm-12 col-md-${ncols} col-lg-${ncols} col-xl-${ncols} mt-4 mb-4`} key={`news${i}`}>
                                    {tagorcatname}

                                    <div className={`card cardnews ${cardgradient()} bshadow rounded`}>
                                        {newsi.isFeatured && (
                                            getFeaturedItem(i)
                                        )}

                                        <Image
                                            src={getImagePath(newsi.image)}
                                            className="card-img-top rounded mx-auto d-block img-fluid"
                                            width={800}
                                            height={400}
                                            alt={"blog image "}
                                            priority
                                        />

                                        <div className={"card-body text-center"}>
                                            <div className={"scard-body"}>
                                                <div className={"card-info"}>
                                                    <div className={"card-author card-text"}>
                                                        {!pathname.includes(`${newsSuffix}/${newsi.categoryId}/${newsi.postId}`) && (
                                                            <div className="container">
                                                                <div className="row justify-content-center align-items-center">
                                                                    <div className="col-auto colauthorright">
                                                                        <Image src={getImagePath(useri.avatar)} className="rounded img-fluid img-author" width={30} height={30} alt={`${useri.displayName}'s avatar`} />
                                                                        <Link href={`/pages/users/${newsi.userId}`} locale={locale ?? getDefLocale()} className="ms-2 txt-author">
                                                                            {useri.displayName}
                                                                        </Link>
                                                                    </div>
                                                                    <div className="col-auto colauthorleft">
                                                                        <i className="bi bi-clock icodate"></i>
                                                                        <span className="ms-2 txtdate" title={"" + newsi.createdAt}>
                                                                            {formatDate(newsi.createdAt!)}
                                                                        </span>
                                                                    </div>

                                                                    {cid != -1 && (
                                                                        <div className="col-auto colauthorleft">
                                                                            <i className="bi bi-bookmark"></i>
                                                                            <Link href={`/${newsSuffix}/${newsi.categoryId}`} locale={locale ?? getDefLocale()} className="txtcategory ms-2" title={`Categoria: ${categoryi.name}`}>
                                                                                {categoryi.name}
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!!pathname.includes(`${newsSuffix}/${newsi.categoryId}/${newsi.postId}`) && (
                                                            <>
                                                                <Image src={getImagePath(useri.avatar)} className="rounded img-fluid img-author" width={30} height={30} alt={`${useri.displayName}'s avatar`} />
                                                                <Link href={`/pages/users/${newsi.userId}`} locale={locale ?? getDefLocale()} className="ms-2 txt-author">
                                                                    {useri.displayName}
                                                                </Link>
                                                                <span className="linesep"></span>
                                                                <i className="bi bi-clock icodate"></i>
                                                                <span className="ms-2 txtdate" title={"" + newsi.createdAt}>
                                                                    {formatDate(newsi.createdAt)}
                                                                </span>

                                                                {cid != -1 && (
                                                                    <>
                                                                        <span className="linesep"></span>
                                                                        <i className="bi bi-bookmark"></i>
                                                                        <Link href={`/${newsSuffix}/${newsi.categoryId}`} locale={locale ?? getDefLocale()} className="txtcategory ms-2" title={`Categoria: ${categoryi.name}`}>
                                                                            {categoryi.name}
                                                                        </Link>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <h5 className="card-title text-center mt-3">{newsi.title}</h5>

                                                {pid != -1 && (
                                                    <MyEditorPost keyid={myEditorKey} value={newsi.content} editable={false} onChange={() => { }} isCleared={false} />
                                                )}

                                                {pid == -1 && (
                                                    <button className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" onClick={(e: any) => redirectToPost(e, newsi)}>{t("btnreadmore") ?? "Read more"}</button>
                                                )}

                                                {cid != -1 && newsi.tags && (
                                                    <div className="form-group mt-3">
                                                        {newsi.tags.sort((a, b) => a.localeCompare(b)).map((tx, itx) => (
                                                            <Link className="btn btn-info btntaginfo btn-rounded ms-2 me-2" key={itx} href={`/${tagsNewsSuffix}/${cid}/${tx.split("#")[1]}`} locale={locale ?? getDefLocale()}>
                                                                <i className="bi bi-tag me-1"></i>
                                                                <span>{tx}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}

                                                {!!enabledViews && !hiddenViews && (
                                                    <div className={"card-footer"}>
                                                        <div className="card-info">
                                                            <div className="container">
                                                                <div className="row">
                                                                    <div className="d-flex flex-row justify-content-start align-items-center">
                                                                        <Views counter={counter} />
                                                                        <button className={"btn btn-primary btn-rounded btnshcomment ms-3 " + (isCommentFormShown ? "active" : "")} onClick={toggleComments}>
                                                                            <i className="bi bi-chat icocomments"></i>
                                                                            <span className="numcomments">{totalComments}</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="card-info">
                                                            <div className="container">
                                                                <div className="row">
                                                                    <Comments userId={newsi.userId} postId={newsi.postId ?? pid} categoryId={newsi.categoryId ?? cid} isCommentFormShown={isCommentFormShown} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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

    const getEmptyNews = (pathname: any): any => {
        return (
            <div className='col-12'>
                <div className="card p-3 text-center">
                    <div className='card-body'>
                        <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
                        <p>
                            {t("emptyposts") ?? "0 news."}
                        </p>

                        {pathname !== "/" || pathname !== `/${getDefLocale()}` && (
                            <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>
                                {tbtn("btnback") ?? "Back"}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getBackLink = (pathname: any): any => {
        return (
            <div className="col-12 mt-3 mx-auto text-center">
                <Link href={pathname !== `/${newsSuffix}` || pathname !== `/${getDefLocale()}/${newsSuffix}` ? "../" : "/"} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block">
                    {tbtn("btnback") ?? "Back"}
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
                <div className="row justify-content-center align-items-center">
                    <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                        {!news || news.length == 0 && !loading && getEmptyNews(pathname)}
                        {!!news && news.length > 0 && getContent()}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}