/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Posts } from "@applocale/interfaces/posts";
import { User } from "@applocale/interfaces/user";
import { Categories } from "@applocale/interfaces/categories";
import { getImagePath, loadMyRealData, shortenLargeNumber } from "@applocale/functions/functions";
import FetchDataAxios, { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import {Link} from '@/app/i18n/navigation';
import { getDefLocale, getLinkLocale } from "@applocale/helpers/defLocale";
import CarouselNews from "@applocale/components/carouselnews";
import MyEditorPost from "@applocale/components/editor/myeditorpost";
import Image from "next/image";

export default function News({ cid, pid, locale }: { cid: number, pid: number, locale: string }) {
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryVal = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
    );

    useEffect(() => {
        async function fetchNews() {
            const params = `?page=${page}&pageSize=${pageSize}`;

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

            setViews(newsdata.length > 0 ? newsdata[0].views : 0);
            setTotalPages(data[0].totalPages);
            setLoading(false);
        }

        fetchNews();

        if (!!loading) {
            loadMyRealData({ hubname: "datahub", skipNegotiation: false, fetchData: fetchNews });
            
            if(!!new URLSearchParams(searchParams.toString()).get("page")) {
                setPage(parseInt(new URLSearchParams(searchParams.toString()).get("page")!.toString(), 0));
            }
        }
    }, [cid, pid, page, views, loading, searchParams]);

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
        const cols = i <= 2 ? 6 : 4;
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
        setViews(views + 1);

        const body = { ...newsi, ["views"]: views + 1 };

        await FetchDataAxios({
            url: "api/posts/" + newsi.postId,
            method: "put",
            data: body,
            reqAuthorize: false
        }).then(() => {
            console.log("Views updated");
            router.push(getLinkLocale() + "/pages/news/" + newsi.categoryId + "/" + newsi.postId);
        }).catch((err) => {
            console.log(err);
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
                                <div className={`col-12 col-sm-6 col-md-${getMultiCols(i, true)} col-lg-${getMultiCols(i, true)} col-xl-${getMultiCols(i, true)} mb-4`} key={"news" + i}>
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

                                            {pathname == "/pages/news/" + newsi.categoryId + "/" + newsi.postId && (
                                                <div className="card-footer">
                                                    <div className="card-info">
                                                        <i className="bi bi-eye"></i>
                                                        <span className="txtviews">{"Views: " + shortenLargeNumber(newsi.views!, 1)}</span>
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
                            <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`}>Back</Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getBackLink = (pathname: any): any => {
        return (
            <div className="col-12 mt-3 mx-auto text-center">
                <Link href={pathname !== "/pages/news" ? "../" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block">
                    Back
                </Link>
            </div>
        );
    };

    const getMyPagination = (): any => {
        const isHiddenNavPagBtns = true;

        const navToPage = (indval: number) => {
            router.push(pathname + "?" + createQueryVal("page", ""+indval));
        };

        const firstPage = () => {
            const indval = (page - page) + 1;
            setPage(indval);
            navToPage(indval);
        };

        const previousPage = () => {
            const indval = page > 1 ? page - 1 : 1;
            setPage(indval);
            navToPage(indval);
        };

        const itemPage = (index: number) => {
            const indval = index + 1;
            setPage(indval);
            navToPage(indval);
        };

        const nextPage = () => {
            const indval = page < totalPages ? page + 1 : totalPages;
            setPage(indval);
            navToPage(indval);
        };

        const lastPage = () => {
            const indval = totalPages;
            setPage(indval);
            navToPage(indval);
        };

        return (
            <nav className="d-flex mx-auto text-center">
                <ul className="pagination mt-3 mx-auto">
                    <li className={`page-item${page === 1 ? " disabled" + (isHiddenNavPagBtns ? " hidden" : "") : ""}`}>
                        <button type="button" className="page-link" onClick={() => firstPage()}>
                            <i className="bi bi-chevron-double-left"></i>
                        </button>
                    </li>
                    <li className={`page-item${page === 1 ? " disabled" + (isHiddenNavPagBtns ? " hidden" : "") : ""}`}>
                        <button type="button" className="page-link" onClick={() => previousPage()}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item${page === index + 1 ? " active" : ""}`}>
                            <button type="button" className="page-link" onClick={() => itemPage(index)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item${page === totalPages ? " disabled" + (isHiddenNavPagBtns ? " hidden" : "") : ""}`}>
                        <button type="button" className="page-link" onClick={() => nextPage()}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </li>
                    <li className={`page-item${page === totalPages ? " disabled" + (isHiddenNavPagBtns ? " hidden" : "") : ""}`}>
                        <button type="button" className="page-link" onClick={() => lastPage()}>
                            <i className="bi bi-chevron-double-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }

    const getContent = () => {
        return (
            <>
                {fetchNewsItems()}
                {cid >= -1 && pid == -1 && getMyPagination()}
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

