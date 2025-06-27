/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { Posts } from "@applocale/interfaces/posts";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { onlyAdmins } from "@applocale/functions/functions";
import FetchData from "@applocale/utils/fetchdata";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import MyPagination from "@applocale/components/ui/mypagination";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import AdvancedSearchPosts from "@applocale/components/ui/forms/search/posts/advsearchposts";

const AdminPosts = () => {
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.PostsPage");
    const ttbl = useTranslations("ui.tables.tabledata");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState(new Array<Posts>());
    const [barToggle, setBarToggle] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");
    const search = searchParams.get("search") ?? "";
    const sortorder = searchParams.get("sortorder") ?? "asc";
    const sortby = searchParams.get("sortby") ?? "id";
    const pageSize: number = 10;

    useEffect(() => {
        async function fetchPosts() {
            const curindex = page;
            const sparams = isSearchEnabled ? `&sortBy=${sortby}&sortOrder=${sortorder}&search=${search}` : ``;
            const params = `?page=${curindex}&pageSize=${pageSize}${sparams}`;

            const data = await FetchData({
                url: 'api/posts' + params,
                method: 'get',
                reqAuthorize:  process.env.NODE_ENV === "production" ? true : false
            });

            if (data.data) {
                setPosts(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }

            setTotalPages(data.totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        fetchPosts();
    }, [logInfo, isAuthorized, isSearchEnabled, page, spage, search, sortby, sortorder]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
                <LoadingComp type="icon" icontype="ring" />
            </div>
        );
    }

    const closeSidebar = () => {
        setBarToggle(true);
    }

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setBarToggle(!barToggle);
    }

    const tableHeaders = [
        { dataIndex: 'postId', title: ttbl('header.postId') ?? 'Post Id' },
        { dataIndex: 'title', title: ttbl('header.title') ?? 'Title' },
        { dataIndex: 'createdAt', title: ttbl('header.createdAt') ?? 'Created At' },
        { dataIndex: 'updatedAt', title: ttbl('header.updatedAt') ?? 'Updated At' },
        { dataIndex: 'slug', title: ttbl('header.slug') ?? 'Slug' },
        { dataIndex: 'userId', title: ttbl('header.userId') ?? 'User Id' }
    ];

    return (
        <div className={"admpage " + astyles.admdashboard} id="admdashboard">
            {!!isAuthorized && (
                <AdminNavbarDashboard logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} locale={locale ?? getDefLocale()} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <AdminSidebarDashboard sidebarStatus={barToggle} toggleSidebar={toggleSidebar} locale={locale ?? getDefLocale()} onClose={closeSidebar} />
                            </div>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <h3 className="text-center titlep">
                                    <i className="bi bi-file-post me-2"></i>
                                    {t("title") ?? "Posts"}
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group btngroupposts" role="group" aria-label="News data actions">
                                                <Link type="button" href={'/pages/news/add'} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btncreatenews" title={t('btnaddnews') ?? "Add news"}>
                                                    <i className="bi bi-plus-circle"></i>
                                                    <span className="ms-2 hidden">
                                                        {t('btnaddnews') ?? "Add news"}
                                                    </span>
                                                </Link>

                                                <button type="button" className="btn btn-primary btn-rounded ms-3" onClick={() => setIsSearchEnabled(!isSearchEnabled)} title={(isSearchEnabled ? (t('btnadvfsearch.disable') ?? " Disable") : (t('btnadvfsearch.enable') ?? " Enable")) + " " + (t("btnadvfsearch.title") ?? 'Advanced filter search').toLowerCase()}>
                                                    <i className="bi bi-search"></i>
                                                    <span className="ms-2 hidden">
                                                        {(isSearchEnabled ? (t('btnadvfsearch.disable') ?? " Disable") : (t('btnadvfsearch.enable') ?? " Enable")) + " " + (t("btnadvfsearch.title") ?? 'Advanced filter search').toLowerCase()}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>


                                        {isSearchEnabled && (
                                            <AdvancedSearchPosts isSearchEnabled={isSearchEnabled} pageIndex={page} pageSize={pageSize} />
                                        )}

                                        {!!posts && (
                                            <div className="col-12 mt-3">
                                                <TableData theaders={tableHeaders} tdata={posts} namep={ttbl('titletable') ?? "news"} locale={locale ?? getDefLocale()} currentPage={page} totalPages={totalPages} linkSuffix="news" tblDataCl="tabledata" />
                                                <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                                            </div>
                                        )}

                                        {!posts && (
                                            <div className='col-12 card p-3 mt-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-file-post" style={{ fontSize: "4rem" }}></i>
                                                    <p>{t("emptyposts") ?? "0 posts"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>
                                        {tbtn('btnback') ?? "Back"}
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default withAuth(AdminPosts, onlyAdmins);