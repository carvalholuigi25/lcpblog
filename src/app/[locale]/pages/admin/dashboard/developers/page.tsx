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
import LoadingComp from "@applocale/components/ui/loadingcomp";
import { useTranslations } from "next-intl";

const AdminDevs = ({ locale }: { locale?: string }) => {
    const t = useTranslations("pages.AdminPages.DevelopersPage");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [barToggle, setBarToggle] = useState(true);
    const [loading, setLoading] = useState(true);
    const isContainerFluid = true;

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && ["admin", "dev"].includes(JSON.parse(logInfo)[0].role) ? true : false);
        setLoading(false);
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

    return (
        <div className={"mpage " + astyles.admdashboard} id="admdashboard">
            {!!isAuthorized && (
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} />
            )}

            <div className="container-fluid mt-3">
                {!!isAuthorized && (
                    <>
                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " p-3"}>
                            <div className="row">
                                <div className={"col-12 col-md-12 col-lg-12"}>
                                    <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarStatus={barToggle} toggleSidebar={toggleSidebar} onClose={closeSidebar} />
                                </div>
                                <div className={"col-12 col-md-12 col-lg-12"}>
                                    <h3 className="text-center titlep">
                                        <i className="bi bi-gear-fill me-2"></i>
                                        {t("title") ?? "Developers"}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 mx-auto text-center p-3"}>
                            <div className="row">
                                <div className="col-12">
                                    <p>{t("lblwarnpage") ?? "Warning: This page is for admins and developers!"}</p>
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

export default withAuth(AdminDevs, ["admin", "dev"]);