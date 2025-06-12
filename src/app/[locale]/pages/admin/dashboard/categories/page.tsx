/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import withAuth from "@applocale/utils/withAuth"
import FetchData from "@applocale/utils/fetchdata";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import Footer from "@applocale/ui/footer";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import MyPagination from "@applocale/components/ui/mypagination";
import { onlyAdmins } from "@applocale/functions/functions";

const AdminCategories = () => {
    const locale = useLocale() ?? getDefLocale();
    const t = useTranslations("pages.AdminPages.CategoriesPage");
    const ttbl = useTranslations("ui.tables.categoriestable");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [categories, setCategories] = useState(new Array<Categories>());
    const [loading, setLoading] = useState(true);
    const [barToggle, setBarToggle] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);

    const searchParams = useSearchParams();
    const spage = searchParams.get("page");

    const pageSize: number = 10;

    useEffect(() => {
        async function fetchCategories() {
            const curindex = page;
            const params = `?page=${curindex}&pageSize=${pageSize}`;

            const data = await FetchData({
                url: 'api/categories' + params,
                method: 'get',
                reqAuthorize: true
            });

            if (data.data) {
                setCategories(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }

            setTotalPages(data.totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        fetchCategories();
    }, [page, spage, logInfo, isAuthorized]);

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
        { dataIndex: 'categoryId', title: ttbl('header.categoryId') ?? 'Category Id' },
        { dataIndex: 'name', title: ttbl('header.name') ?? 'Name' },
        { dataIndex: 'slug', title: ttbl('header.slug') ?? 'Slug' },
        { dataIndex: 'createdAt', title: ttbl('header.createdAt') ?? 'Created At' },
        { dataIndex: 'updatedAt', title: ttbl('header.updatedAt') ?? 'Updated At' },
        { dataIndex: 'status', title: ttbl('header.status') ?? 'Status' }
    ];

    return (
        <div className={"admpage " + astyles.admdashboard} id="admdashboard">
            {!!isAuthorized && (
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarStatus={barToggle} toggleSidebar={toggleSidebar} onClose={closeSidebar} />
                            </div>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <h3 className="text-center titlep">
                                    <i className="bi bi-card-list me-2"></i>
                                    {t("title") ?? "Categories"}
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group" role="group" aria-label="Users data actions">
                                                <Link href={'/' + locale + '/pages/admin/dashboard/categories/add'} className="btn btn-primary btn-rounded btncreatecategories" title={t('btnaddcategory') ?? "Add new category"}>
                                                    <i className="bi bi-plus-circle"></i>
                                                    <span className="ms-2 hidden">
                                                        {t('btnaddcategory') ?? "Add new category"}
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>

                                        {!!categories && (
                                            <div className="col-12 mt-3">
                                                <TableData locale={locale ?? getDefLocale()} theaders={tableHeaders} tdata={categories} namep={ttbl('titletable') ?? "categories"} currentPage={-1} totalPages={-1} linkSuffix="admin/dashboard/categories" tblDataCl="categoriestable" />
                                                <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                                            </div>
                                        )}

                                        {!categories && (
                                            <div className='col-12 mt-3 card p-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-people" style={{ fontSize: "4rem" }}></i>
                                                    <p>
                                                        {t('emptycategories') ?? "0 categories."}
                                                    </p>
                                                </div>
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
    );
}

export default withAuth(AdminCategories, onlyAdmins);