/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
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
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState(new Array<User>());
    const [sidebarToggle, setSidebarToggle] = useState(true);

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

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setSidebarToggle(!sidebarToggle);
    }

    const tableHeaders = [
        { dataIndex: 'userId', title: 'User Id' },
        { dataIndex: 'username', title: 'Username' },
        { dataIndex: 'email', title: 'Email' },
        { dataIndex: 'displayName', title: 'Display Name' },
        { dataIndex: 'role', title: 'Role' },
    ];

    return (
        <div className={astyles.admdashboard}>
            {!!isAuthorized && (
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
                            </div>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "9" : "12") + " col-lg-" + (!sidebarToggle ? "10" : "12") + ""}>
                                <h3 className="text-center">
                                    <i className="bi bi-people me-2"></i>
                                    Users
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group" role="group" aria-label="Users data actions">
                                                <Link href={'/pages/users/add'} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btncreateusers">Add new user</Link>
                                            </div>
                                        </div>

                                        {!!users && (
                                            <div className="col-12 mt-3">
                                                <TableData locale={locale ?? getDefLocale()} theaders={tableHeaders} tdata={users} namep="users" currentPage={-1} totalPages={-1} linkSuffix="" />
                                            </div>
                                        )}

                                        {!users && (
                                            <div className='col-12 mt-3 card p-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-people" style={{ fontSize: "4rem" }}></i>
                                                    <p>0 users</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>Back</Link>
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