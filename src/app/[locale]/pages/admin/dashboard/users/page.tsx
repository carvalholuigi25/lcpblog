/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { User } from "@applocale/interfaces/user";
import { getDefLocale } from "@applocale/helpers/defLocale";
import {Link} from '@/app/i18n/navigation';
import FetchData from "@applocale/utils/fetchdata";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/loadingcomp";

const AdminUsers = () => {
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.UsersPage");
    const ttbl = useTranslations("ui.tables.userstable");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState(new Array<User>());
    const [barToggle, setBarToggle] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            const data = await FetchData({
                url: 'api/users',
                method: 'get',
                reqAuthorize: true
            });

            if (data.data) {
                setUsers(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        fetchUsers();
    }, [logInfo, isAuthorized]);

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
        { dataIndex: 'userId', title: ttbl("header.userId") ?? 'User Id' },
        { dataIndex: 'username', title: ttbl("header.username") ?? 'Username' },
        { dataIndex: 'email', title: ttbl("header.email") ?? 'Email' },
        { dataIndex: 'displayName', title: ttbl("header.displayName") ?? 'Display Name' },
        { dataIndex: 'role', title: ttbl('header.role') ?? 'Role' },
    ];

    return (
        <div className={astyles.admdashboard + " fixed"} id="admdashboard">
            {!!isAuthorized && (
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-" + (!barToggle ? "3" : "12") + " col-lg-" + (!barToggle ? "2" : "12")}>
                                <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarStatus={barToggle} toggleSidebar={toggleSidebar} onClose={closeSidebar} />
                            </div>
                            <div className={"col-12 col-md-" + (!barToggle ? "9" : "12") + " col-lg-" + (!barToggle ? "10" : "12") + ""}>
                                <h3 className="text-center titlep">
                                    <i className="bi bi-people me-2"></i>
                                    {t("title") ?? "Users"}
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group" role="group" aria-label="Users data actions">
                                                <Link href={'/pages/users/add'} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btncreateusers" title={t('btnadduser') ?? "Add new user"}>
                                                    <i className="bi bi-plus-circle"></i>
                                                    <span className="ms-2 hidden">{t('btnadduser') ?? "Add new user"}</span>
                                                </Link>
                                            </div>
                                        </div>

                                        {!!users && (
                                            <div className="col-12 mt-3">
                                                <TableData theaders={tableHeaders} tdata={users} namep={ttbl('titletable') ?? "users"} locale={locale ?? getDefLocale()} currentPage={-1} totalPages={-1} linkSuffix="users" />
                                            </div>
                                        )}

                                        {!users && (
                                            <div className='col-12 mt-3 card p-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-people" style={{ fontSize: "4rem" }}></i>
                                                    <p>{t('emptyusers') ?? '0 users'}</p>
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

export default withAuth(AdminUsers, ["admin"]);