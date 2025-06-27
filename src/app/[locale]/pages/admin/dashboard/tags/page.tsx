/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { Tags } from "@applocale/interfaces/tags";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import astyles from "@applocale/styles/adminstyles.module.scss";
import FetchData from "@applocale/utils/fetchdata";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import MyPagination from "@applocale/components/ui/mypagination";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import AdvancedSearchTags from "@applocale/components/ui/forms/search/tags/advsearchtags";
import { onlyAdmins } from "@applocale/functions/functions";

const AdminTags = () => {
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.TagsPage");
    const ttbl = useTranslations("ui.tables.tagstable");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState(new Array<Tags>());
    const [barToggle, setBarToggle] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isSearchEnabled, setIsSearchEnabled] = useState(false);
    const searchParams = useSearchParams();
    const spage = searchParams.get("page");
    const search = searchParams.get("search") ?? "";
    const sortorder = searchParams.get("sortorder") ?? "asc";
    const sortby = searchParams.get("sortby") ?? "tagId";
    const pageSize: number = 10;

    useEffect(() => {
        async function fetchTags() {
            const curindex = page;
            const sparams = isSearchEnabled ? `&sortBy=${sortby}&sortOrder=${sortorder}&search=${search}` : ``;
            const params = `?page=${curindex}&pageSize=${pageSize}${sparams}`;

            const data = await FetchData({
                url: 'api/tags' + params,
                method: 'get',
                reqAuthorize:  process.env.NODE_ENV === "production" ? true : false
            });

            if (data.data) {
                setTags(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }

            setTotalPages(data.totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        fetchTags();
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
        { dataIndex: 'tagId', title: ttbl('header.tagId') ?? 'Tag Id' },
        { dataIndex: 'name', title: ttbl('header.name') ?? 'Name' },
        { dataIndex: 'createdAt', title: ttbl('header.createdAt') ?? 'Created At' },
        { dataIndex: 'updatedAt', title: ttbl('header.updatedAt') ?? 'Updated At' },
        { dataIndex: 'status', title: ttbl('header.status') ?? 'Status' }
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
                                    <i className="bi bi-tag me-2"></i>
                                    {t("title") ?? "Tags"}
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group btngrouptags" role="group" aria-label="Tags data actions">
                                                <Link type="button" href={'/pages/admin/dashboard/tags/add'} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btncreatetags" title={t('btnaddnewtag') ?? "Add new tag"}>
                                                    <i className="bi bi-plus-circle"></i>
                                                    <span className="ms-2 hidden">
                                                        {t('btnaddnewtag') ?? "Add new tag"}
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
                                            <AdvancedSearchTags isSearchEnabled={isSearchEnabled} pageIndex={page} pageSize={pageSize} />
                                        )}

                                        {!!tags && (
                                            <div className="col-12 mt-3">
                                                <TableData theaders={tableHeaders} tdata={tags} namep={ttbl('titletable') ?? "tags"} locale={locale ?? getDefLocale()} currentPage={page} totalPages={totalPages} linkSuffix="admin/dashboard/tags" tblDataCl="tagstable" />
                                                <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                                            </div>
                                        )}

                                        {!tags && (
                                            <div className='col-12 card p-3 mt-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-file-tag" style={{ fontSize: "4rem" }}></i>
                                                    <p>{t("emptytags") ?? "0 tags"}</p>
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

export default withAuth(AdminTags, onlyAdmins);