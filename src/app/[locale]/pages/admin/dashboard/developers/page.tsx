/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { getDefLocale } from "@applocale/helpers/defLocale";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/loadingcomp";

const AdminDevs = ({ locale }: { locale?: string }) => {
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(true);
    const [loading, setLoading] = useState(true);
    const isContainerFluid = true;

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
                <LoadingComp type="icon" icontype="ring" />
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
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
            )}

            <div className="container-fluid mt-3">
                {!!isAuthorized && (
                    <>
                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " p-3"}>
                            <div className="row">
                                <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                    <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
                                </div>
                                <div className={"col-12 col-md-" + (!sidebarToggle ? "9" : "12") + " col-lg-" + (!sidebarToggle ? "10" : "12") + ""}>
                                    <h3 className="text-center">
                                        <i className="bi bi-gear-fill me-2"></i>
                                        Developers
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 mx-auto text-center p-3"}>
                            <div className="row">
                                <div className="col-12">
                                    <p>Warning: This page is for admins and developers!</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default withAuth(AdminDevs, ["admin"]);