/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import Link from "next/link";
import Image from "next/image";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { getVideoImgPath, onlyAdmins } from "@applocale/functions/functions";
import { Media } from "@applocale/interfaces/media";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import FetchData from "@applocale/utils/fetchdata";
import MyPagination from "@applocale/components/ui/mypagination";
import AdvancedSearchMedia from "@applocale/components/ui/forms/search/media/advsearchmedia";

const AdminVideos = () => {
    const locale = useLocale() ?? getDefLocale();
    const t = useTranslations("pages.AdminPages.VideosPage");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [barToggle, setBarToggle] = useState(true);
    const [videos, setVideos] = useState(new Array<Media>());
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");
    const search = searchParams.get("search") ?? "";
    const sortorder = searchParams.get("sortorder") ?? "asc";
    const sortby = searchParams.get("sortby") ?? "mediaId";
    const pageSize: number = 10;

    useEffect(() => {
        async function fetchVideos() {
            const curindex = page;
            const sparams = isSearchEnabled ? `&sortBy=${sortby}&sortOrder=${sortorder}&search=${search}` : ``;
            const params = `?page=${curindex}&pageSize=${pageSize}${sparams}`;

            const data = await FetchData({
                url: 'api/medias' + params,
                method: 'get',
                reqAuthorize: false
            });

            if (data.data) {
                setVideos(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }

            setTotalPages(data.totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
            setLoading(false);
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        fetchVideos();
    }, [logInfo, isAuthorized, page, isSearchEnabled, sortby, sortorder, search, spage]);

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

    return (
        <div className={"admpage " + astyles.admdashboard} id="admdashboard">
            {!!isAuthorized && (
                <AdminNavbarDashboard logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} locale={locale} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <AdminSidebarDashboard sidebarStatus={barToggle} toggleSidebar={toggleSidebar} locale={locale} onClose={closeSidebar} />
                            </div>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <h3 className="text-center titlep">
                                    <i className="bi bi-file-earmark-play me-2"></i>
                                    {t("title") ?? "Videos"}
                                </h3>
                                <div className="container mt-3">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group btngroupmedia" role="group" aria-label="Media data actions">
                                                <Link type="button" href={`/${locale}/pages/admin/dashboard/videos/add`} className="btn btn-primary btn-rounded btnaddvideos" title={t('btnaddvideos') ?? "Add videos info"}>
                                                    <i className="bi bi-plus-circle"></i>
                                                    <span className="ms-2 hidden">
                                                        {t('btnaddvideos') ?? "Add videos info"}
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
                                            <AdvancedSearchMedia isSearchEnabled={isSearchEnabled} pageIndex={page} pageSize={pageSize} />
                                        )}

                                        {!videos || videos.length == 0 && (
                                            <div className='col-12 card p-3 mt-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-file-earmark-play" style={{ fontSize: "4rem" }}></i>
                                                    <p>{t("emptyvideos") ?? "0 videos"}</p>
                                                </div>
                                            </div>
                                        )}

                                        {videos && videos.length > 0 && (
                                            <div className="col-12 mt-3">
                                                {videos.map(x => (
                                                    <div key={x.mediaId} className="col-12 col-md-6 col-lg-4">
                                                        <div className="card cardvideos cardlg bshadow rounded">
                                                            <Link href={`/${locale}/pages/admin/dashboard/videos/${x.mediaId}`}>
                                                                <Image src={getVideoImgPath(x.thumbnail)} className="card-img-top rounded mx-auto d-block img-fluid img-thumbnail p-0" width={150} height={150} alt={x.title ?? x.description ?? "Video " + x.mediaId} />
                                                            </Link>

                                                            <div className="card-body">
                                                                <div className="scard-body">
                                                                    <div className={"card-info"}>
                                                                        <div className="card-text p-3">
                                                                            <p>{x.title}</p>
                                                                            
                                                                            {logInfo && (
                                                                                <div className="mt-3">
                                                                                    <Link type="button" href={`/${locale}/pages/admin/dashboard/videos/edit/${x.mediaId}`} className="btn btn-primary btn-rounded btneditvideos" title={t('btneditvideos') ?? "Edit videos info"}>
                                                                                        <i className="bi bi-pencil"></i>
                                                                                        <span className="ms-2 hidden">
                                                                                            {t('btneditvideos') ?? "Edit videos info"}
                                                                                        </span>
                                                                                    </Link>

                                                                                    <Link type="button" href={`/${locale}/pages/admin/dashboard/videos/delete/${x.mediaId}`} className="btn btn-primary btn-rounded btndelvideos ms-1" title={t('btndelvideos') ?? "Delete videos"}>
                                                                                        <i className="bi bi-x-lg"></i>
                                                                                        <span className="ms-2 hidden">
                                                                                            {t('btndelvideos') ?? "Delete videos info"}
                                                                                        </span>
                                                                                    </Link>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale}>
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

export default withAuth(AdminVideos, onlyAdmins);