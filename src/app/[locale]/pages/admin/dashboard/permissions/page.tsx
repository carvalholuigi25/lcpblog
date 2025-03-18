/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import astyles from "@applocale/styles/adminstyles.module.scss";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

export interface PermissionsGroupsCl {
    id: number;
    name: string;
    checked: boolean;
}

export interface PermissionsCl {
    permissionsId: number;
    title: string;
    action: string;
    groups: PermissionsGroupsCl[];
}

export const listPermissions = (): PermissionsCl[] => {
    return [{
        permissionsId: 1,
        title: "Create Posts",
        action: "create_posts",
        groups: [{
            id: 1,
            name: "admins",
            checked: true,
        },
        {
            id: 2,
            name: "moderators",
            checked: true,
        },
        {
            id: 3,
            name: "users",
            checked: true,
        }],
    },
    {
        permissionsId: 2,
        title: "Edit Posts",
        action: "edit_posts",
        groups: [{
            id: 1,
            name: "admins",
            checked: true,
        },
        {
            id: 2,
            name: "moderators",
            checked: true,
        },
        {
            id: 3,
            name: "users",
            checked: true,
        }],
    },
    {
        permissionsId: 3,
        title: "Delete Posts",
        action: "delete_posts",
        groups: [{
            id: 1,
            name: "admins",
            checked: true,
        },
        {
            id: 2,
            name: "moderators",
            checked: true,
        },
        {
            id: 3,
            name: "users",
            checked: true,
        }],
    }];
}

export const listGroups = (): any[] => {
    return listPermissions().map(x => x.groups)
};

export default function AdminPosts({ locale }: { locale: string }) {
    const [logInfo, setLogInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(true);
    const [permInfo, setPermInfo]: any = useState({
        permissions: [],
        response: [],
    });

    const handleChange = (e: any) => {
        const { value, checked } = e.target;
        const { permissions } = permInfo;

        if (checked) {
            setPermInfo({
                permissions: [...permissions, value],
                response: [...permissions, value],
            });
        } else {
            setPermInfo({
                permissions: permissions.filter((e: any) => e !== value),
                response: permissions.filter((e: any) => e !== value),
            });
        }
    };
    
    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        setLoading(false);
    }, [logInfo, isAuthorized]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
                <div className='container-fluid'>
                    <div className='row justify-content-center align-items-center p-3'>
                        <div className='col-12 card p-3 text-center'>
                            <div className='card-body'>
                                <i className="bi bi-clock" style={{ fontSize: "4rem" }}></i>
                                <p>Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setSidebarToggle(!sidebarToggle);
    }

    return (
        <div className={astyles.admdashboard}>
            {!!isAuthorized && (
                <AdminNavbarDashboard logInfo={logInfo} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} locale={locale ?? getDefLocale()} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                <AdminSidebarDashboard sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} locale={locale ?? getDefLocale()} />
                            </div>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "9" : "12") + " col-lg-" + (!sidebarToggle ? "10" : "12") + ""}>
                                <h3 className="text-center">
                                    <i className="bi bi-lock me-2"></i>
                                    Permissions
                                </h3>
                                <div className="container mt-3 mb-3">
                                    <div className="row">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-autolayout">
                                                <thead>
                                                    <tr>
                                                        <th>Actions/Roles</th>
                                                        {listGroups().map((theader: any, i: number) => (
                                                            <th key={"thv" + i} style={{textTransform: 'capitalize'}}>{theader[i].name}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listPermissions().map((tdataitem: any, i: number) => {
                                                        const groups = tdataitem['groups'];
                                                        const action = tdataitem['action'];
                                                        const title = tdataitem['title'];

                                                        return (
                                                            <tr key={"x" + i}>
                                                                <td>
                                                                    <label className="ms-1">{title}</label>
                                                                </td>
                                                                
                                                                {groups.map((v: any, k: number) => (
                                                                    <td key={"tdx" + k}>
                                                                        <label htmlFor={"inpperm" + action + k + "_" + v.name} className="ms-1 hidden">{title}</label>
                                                                        <input type="checkbox" name={"inpperm" + action + k + "_" + v.name} id={"inpperm" + action + k + "_" + v.name} value={action + "_" + v.name} onChange={handleChange} />
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {permInfo.response.length > 0 && (
                                        <div className="row">
                                            <div className="col-12">
                                                <textarea className="form-control" name="response" value={"Permissions: " + permInfo.response} disabled />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded">Back</Link>
                                </div>
                            </div>
                        </>
                    )}

                    {!isAuthorized && (
                        <div className="col-12 mt-3">
                            <div className="card mx-auto">
                                <div className="card-body text-center">
                                    <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem" }} />
                                    <h3>Warning</h3>
                                    <p>You are not authorized to view this page!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}