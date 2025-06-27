/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import Link from "next/link";
import Image from "next/image";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { getVideoThumbnailPath, onlyAdmins } from "@applocale/functions/functions";
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");
    const search = searchParams.get("search") ?? "";
    const sortby = "mediafeat";
    const sortorder = searchParams.get("sortorder") ?? "desc";
    const fieldname = searchParams.get("fieldname") ?? "isFeatured";
    const pageSize: number = 10;

    useEffect(() => {
        async function fetchVideos() {
            const curindex = page;
            const sparams = isSearchEnabled ? `&fieldName=${fieldname}&search=${search}` : ``;
            const params = `?page=${curindex}&pageSize=${pageSize}${sparams}&sortBy=${sortby}&sortOrder=${sortorder}`;

            const data = await FetchData({
                url: 'api/medias' + params,
                method: 'get',
                reqAuthorize:  process.env.NODE_ENV === "production" ? true : false
            });

            if (data.data) {
                setVideos(JSON.parse(JSON.stringify(data.data)));
            }

            setTotalPages(data.totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        fetchVideos();
        setLoading(false);
    }, [logInfo, isAuthorized, page, isSearchEnabled, sortby, sortorder, search, spage, fieldname]);

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

    const getFeaturedItem = (i: number) => {
        return i == 0 ? (
            <div className="card-info-featured-wrapper">
                <div className="card-info-featured">
                    <i className="bi bi-star-fill"></i>
                </div>
            </div>
        ) : "";
    };

    const getThumbnail = (x: Media) => {
        return getVideoThumbnailPath(x.thumbnail!.replace("videos/thumbnails/", ""));
    }

    const redirectToEdit = (e: any, x: Media) => {
        e.preventDefault();
        return router.push(`/${locale}/pages/admin/dashboard/videos/edit/${x.mediaId}`);
    }

    const redirectToDel = (e: any, x: Media) => {
        e.preventDefault();
        return router.push(`/${locale}/pages/admin/dashboard/videos/delete/${x.mediaId}`);
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
                                    <div className="row mx-auto justify-content-center">
                                        <div className="col-12 ps-3 pe-3">
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
                                            <div className="row mt-3 mx-auto justify-content-center">
                                                {videos.map((x, i) => (
                                                    <div key={x.mediaId} className="col-12 col-md-6 col-lg-4 p-3">
                                                        <Link href={`/${locale}/pages/admin/dashboard/videos/${x.mediaId}`}>
                                                            <div className="card cardvideos cardlg bshadow rounded">
                                                                <Image src={getThumbnail(x)} className="card-img-top rounded mx-auto d-block img-fluid img-thumbnail p-0" width={150} height={150} alt={x.title ?? x.description ?? "Video " + x.mediaId} />

                                                                <div className="card-header">
                                                                    {x.isFeatured && (
                                                                        getFeaturedItem(i)
                                                                    )}

                                                                    {logInfo && (
                                                                        <div className="card-info-actions-wrapper">
                                                                            <div className="card-info-actions">
                                                                                <button type="button" className="btn btn-primary btn-rounded btneditvideos" title={t('btneditvideos') ?? "Edit videos info"} onClick={(e) => redirectToEdit(e, x)}>
                                                                                    <i className="bi bi-pencil"></i>
                                                                                    <span className="ms-2 hidden">
                                                                                        {t('btneditvideos') ?? "Edit videos info"}
                                                                                    </span>
                                                                                </button>

                                                                                <button type="button" className="btn btn-primary btn-rounded btndelvideos ms-1" title={t('btndelvideos') ?? "Delete videos"} onClick={(e) => redirectToDel(e, x)}>
                                                                                    <i className="bi bi-x-lg"></i>
                                                                                    <span className="ms-2 hidden">
                                                                                        {t('btndelvideos') ?? "Delete videos info"}
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="card-body">
                                                                    <div className="scard-body">
                                                                        <div className={"card-info"}>
                                                                            <div className="card-text p-3">
                                                                                <p>{x.title}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
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