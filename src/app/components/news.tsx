/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { Posts } from "@/app/interfaces/posts";
import { FetchMultipleData } from "@/app/utils/fetchdata";
import { User } from "@/app/interfaces/user";
import CarouselNews from "./carouselnews";
import styles from "@/app/page.module.scss";
import Image from "next/image";
import Link from "next/link";
import MyEditorPost from "./editor/myeditorpost";

export default function News({ pid }: { pid: number }) {
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchNews() {
            const data = await FetchMultipleData([
                {
                    url: 'api/posts',
                    method: 'get',
                    reqAuthorize: false
                },
                {
                    url: 'api/users',
                    method: 'get',
                    reqAuthorize: false
                }
            ]);

            const newsdata = pid > -1 ? data[0].data.filter((item: Posts) => item.postId == pid) : data[0].data;
            const usersdata = data[1].data;
            setNews(JSON.parse(JSON.stringify(newsdata)));
            setUsers(JSON.parse(JSON.stringify(usersdata)));
            setLoading(false);
        }
        fetchNews()
    }, [pid, loading]);

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
        return isMulticolsEnabled ? i == 0 ? 12 : i <= 2 ? 6 : 4 : 12;
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
    
    const fetchNewsItems = (): any => {
        const items: any[] = [];

        users.map((useri) => {
            news.map((newsi, i) => {
                if(newsi.userId == useri.userId) {
                    items.push(
                        <div className={`col-12 col-sm-6 col-md-${getMultiCols(i, true)} col-lg-${getMultiCols(i, true)} col-xl-${getMultiCols(i, true)} mb-4`} key={"news"+i}>
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
                                            <Link href={"/pages/users/"+newsi.userId} className="txt-author">
                                                {useri.displayName}
                                            </Link>
                                            <span className="linesep"></span>
                                            <i className="bi bi-clock icodate"></i>
                                            <span className="ms-2 txtdate" title={""+newsi.createdAt}>
                                                {new Date(newsi.createdAt).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute:'2-digit', second:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
        
                                    <h5 className="card-title text-center">{newsi.title}</h5>
                                    
                                    {pid != -1 && (
                                        <MyEditorPost value={newsi.content} editable={false} onChange={() => {}}  />
                                    )}

                                    {pid == -1 && (
                                        <Link href={"/pages/news/" + newsi.postId} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block">Read more</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
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

