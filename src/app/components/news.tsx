/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { FetchMultipleData } from "@/app/utils/fetchdata";
import { Posts } from "@/app/interfaces/posts";
import { User } from "@/app/interfaces/user";
import { Categories } from "../interfaces/categories";
import { loadMyRealData } from "../functions/functions";
import CarouselNews from "./carouselnews";
import styles from "@/app/page.module.scss";
import Image from "next/image";
import Link from "next/link";
import MyEditorPost from "./editor/myeditorpost";
import FetchDataAxios from "../utils/fetchdataaxios";

export default function News({ cid, pid }: { cid: number, pid: number }) {
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [loading, setLoading] = useState(true);
    const [views, setViews] = useState(0);
    const enableViews = true;
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        async function fetchNews() {
            const data = await FetchMultipleData([
                {
                    url: "api/posts",
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

            setNews(JSON.parse(JSON.stringify(newsdata)));
            setUsers(JSON.parse(JSON.stringify(usersdata)));
            setCategories(JSON.parse(JSON.stringify(categories)));

            if(!!enableViews) {
                setViews(newsdata.length > 0 ? newsdata[0].views : 0);
            }

            setLoading(false);
        }

        fetchNews();

        if (!loading) {
            loadMyRealData({ hubname: "datahub", skipNegotiation: false, fetchData: fetchNews });
        }
    }, [cid, pid, views, enableViews, loading]);

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

        if(!!enableViews) {
            setViews(views + 1);

            const body = { ...newsi, ["views"]: views + 1 };

            await FetchDataAxios({
                url: "api/posts/" + newsi.postId,
                method: "put",
                data: body,
                reqAuthorize: false
            }).then(() => {
                console.log("Views updated");
                router.push("/pages/news/" + newsi.categoryId + "/" + newsi.postId);
            }).catch((err) => {
                console.log(err);
            });
        }
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
                                            src={`/images/${newsi.image}`}
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
                                                    <Image src={"/images/" + (useri.avatar ?? 'avatars/user.png')} className="rounded img-fluid img-author" width={30} height={30} alt={useri.displayName + "'s avatar"} />
                                                    <Link href={"/pages/users/" + newsi.userId} className="txt-author">
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
                                                            <Link href={"/pages/news/" + newsi.categoryId} className="txtcategory ms-2" title={"Categoria: " + categoryi.name}>
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

                                            {!!enableViews && pathname == "/pages/news/" + newsi.categoryId + "/" + newsi.postId && (
                                                <div className="card-footer">
                                                    <div className="card-info">
                                                        <i className="bi bi-eye"></i>
                                                        <span className="txtviews">{"Views: " + newsi.views}</span>
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
                <Link href={pathname !== "/pages/news" ? "/pages/news" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block">
                    Back
                </Link>
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <CarouselNews news={news} pathname={pathname} />

            <div className="container">
                <div className="row justify-content-center align-items-center mt-5 mb-5">
                    {!news || news.length == 0 && getEmptyNews(pathname)}
                    {!!news && news.length > 0 && fetchNewsItems()}
                    {pathname !== "/" && news.length > 0 && getBackLink(pathname)}
                </div>
            </div>
        </div>
    );
}

