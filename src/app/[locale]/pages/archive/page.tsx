"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { useMySuffix } from "@/app/[locale]/hooks/suffixes";

export const getYearList = (): any => {
    const yitem: any[] = [];
    const actyear = new Date().getFullYear();

    for (let i = actyear; i <= (actyear + 10); i++) {
        yitem.push(i);
    }

    return yitem;
}

export const getMonthList = (lblm: any): any => {
    const keys: any[] = [];
    const itemsmonths: any[] = [];

    for(let i = 1; i <= 12; i++) {
        keys.push('month'+i);
    }
        
    if(keys.length > 0) {
        keys.map((key: any, i: number): any => {
            itemsmonths.push({
                id: i+1,
                name: lblm(`${key}.name`)
            });
        });
    }

    return itemsmonths;
}

export default function Archive({ locale }: { locale: string }) {
    const t = useTranslations('ui.buttons');
    const tpag = useTranslations('pages.ArchivePage');
    const lblm = useTranslations('pages.ArchivePage.lblmonths') as any;
    const newsSuffix = useMySuffix("news");
    
    const [news, setNews] = useState(new Array<Posts>());
    const [users, setUsers] = useState(new Array<User>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [totalComments, setTotalComments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const yearlist: any[] = getYearList();
    const monthlist: any[] = getMonthList(lblm);
    const pageSize: number = 10;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");
    const syear = searchParams.get("year");
    const smonth = searchParams.get("month");
    const [year, setYear] = useState(syear ?? new Date().getFullYear());
    const [month, setMonth] = useState(smonth ?? new Date().getMonth() + 1);

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

            const newsdata = year && month ? data[0].data.filter((x: any) => year == new Date(x.createdAt).getFullYear() && month == (new Date(x.createdAt).getMonth() + 1)) : (year ? data[0].data.filter((x: any) => year == new Date(x.createdAt).getFullYear()) : data[0].data);
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
    }, [locale, pathname, loading, page, year, month, spage, syear, smonth]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }
    
    const onYearChange = (e: any) => {
        e.preventDefault();
        setYear(e.target.value);
        router.push(pathname + "?year=" + e.target.value + "&month=" + month);
    }

    const onMonthChange = (e: any) => {
        e.preventDefault();
        setMonth(e.target.value);
        router.push(pathname + "?year=" + year + "&month=" + e.target.value);
    }

    const setToday = (e: any) => {
        e.preventDefault();
        const tyear = new Date().getFullYear();
        const tmonth = parseInt(""+(new Date().getMonth()+1));
        setYear(tyear);
        setMonth(tmonth);
        fetchNewsItems();
        router.push(pathname + "?year=" + tyear + "&month=" + tmonth);
    }

    const getEmptyNews = (pathname: any): any => {
        return (
            <div className='col-12 mt-3'>
                <div className="card p-3 text-center">
                    <div className='card-body'>
                        <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
                        <p>{tpag('lblemptynews') ?? "0 news"}</p>
                        {pathname !== "/" && (
                            <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>
                                {tpag("btnback") ?? "Back"}
                            </Link>
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
                                <div className={`col-12 mt-3 mb-4`} key={"news" + i}>
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
                                                <div className={"card-body"}>
                                                    <h5 className="card-title mt-3">{newsi.title}</h5>
                                                    <div className={"card-author card-text mt-3"}>
                                                        <div className="container">
                                                            <div className="row justify-content-center align-items-center">
                                                                <div className="col-12 col-md-12 col-lg-auto mt-3">
                                                                    <Image src={getImagePath(useri.avatar)} className="rounded img-fluid img-author" width={30} height={30} alt={useri.displayName + "'s avatar"} />
                                                                    <Link href={"/pages/users/" + newsi.userId} locale={locale ?? getDefLocale()} className="ms-2 txt-author">
                                                                        {useri.displayName}
                                                                    </Link>
                                                                </div>
                                                                <div className="col-12 col-md-12 col-lg-auto mt-3">
                                                                    <i className="bi bi-clock icodate"></i>
                                                                    <span className="ms-2 txtdate" title={"" + newsi.createdAt}>
                                                                        {new Date(newsi.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <div className="col-12 col-md-12 col-lg-auto mt-3">
                                                                    <i className="bi bi-bookmark"></i>
                                                                    <Link href={"/" + newsSuffix + newsi.categoryId} locale={locale ?? getDefLocale()} className="txtcategory ms-2" title={"Categoria: " + categoryi.name}>
                                                                        {categoryi.name}
                                                                    </Link>
                                                                </div>
                                                                <div className="col-12 col-md-12 col-lg-auto mt-3">
                                                                    <i className="bi bi-chat icocomments"></i>
                                                                    <span className="numcomments ms-2">{totalComments}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card-footer mt-3">
                                                        <Link href={`/${locale ?? getDefLocale()}/${newsSuffix}/${newsi.categoryId}/${newsi.postId}`} className="btn btn-primary btn-rounded mx-auto d-inline-block">
                                                            {t("btnreadmore") ?? "Read more"}
                                                        </Link>
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

    const getTimeControls = () => {
        return (
            <div className="container p-0">
                <div className="row justify-content-center align-items-center">
                    {yearlist && (
                        <div className="col-12 col-md-6">
                            <label htmlFor="selyeararch">{tpag('lblyear') ?? "Year"}</label>
                            <select value={syear ?? year} className="form-control mt-3 mb-3 selyeararch" onChange={onYearChange}>
                                <option disabled>{tpag('lbldefopyear') ?? "Select the year"}</option>
                                {yearlist.map(y => (
                                    <option value={y} key={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {monthlist && (
                        <div className="col-12 col-md-6">
                            <label htmlFor="selmontharch">{tpag('lblmonth') ?? "Month"}</label>
                            <select value={smonth ?? month} className="form-control mt-3 mb-3 selmontharch" onChange={onMonthChange}>
                                <option disabled>{tpag('lbldefopmonth') ?? "Select the month"}</option>
                                {monthlist.map(m => (
                                    <option value={m.id} key={m.id} data-name={m.name}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="row justify-content-center align-items-center">
                    <div className="col-12">
                        <button type="button" className="btn btn-primary btn-rounded btntoday" onClick={setToday}>
                            {t('btntoday') ?? 'Hoje'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page} id="marchivepage" style={{ paddingTop: '5rem' }}>
            <Header locale={locale ?? getDefLocale()} />
            <section>
                <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center">
                                <h3 className="title mt-3 mb-3">
                                    <i className="bi bi-archive"></i>
                                    <span className="ms-2">{tpag('title') ?? "Archive"}</span>
                                </h3>

                                {getTimeControls()}

                                <div className="contentblk d-block mt-3">
                                    {!news || news.length == 0 && getEmptyNews(pathname)}
                                    {!!news && news.length > 0 && fetchNewsItems()}
                                    <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Suspense>
            </section>
            <Footer />
        </div>
    )
}