/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import FileSingleUploadForm from "@applocale/components/ui/forms/upload/singleupload";
import FileMultiUploadForm from "@applocale/components/ui/forms/upload/multiupload";
import FileDragDropUploadForm from "@applocale/components/ui/forms/upload/dragdropupload";
import UploadedFiles from "@applocale/components/ui/uploadedfiles";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import { onlyAdmins } from "@applocale/functions/functions";

const AdminMedia = () => {
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.MediaPage");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [barToggle, setBarToggle] = useState(true);
    const [typeUpload, setTypeUpload] = useState("single");
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        setShowUpload(getFromStorage("showUpload")! == "true" ? true : false);
        setTypeUpload(getFromStorage("typeUpload")!);
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

    const changeTypeUpload = (e: any) => {
        e.preventDefault();
        saveToStorage("typeUpload", e.target.value);
        setTypeUpload(e.target.value);
    }

    const changeShowUpload = (e: any) => {
        e.preventDefault();
        saveToStorage("showUpload", !showUpload);
        setShowUpload(!showUpload);
    }

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
                                    <i className="bi bi-cloud-upload-fill me-2"></i>
                                    {t("title") ?? "Upload Files"}
                                </h3>

                                <div className="container p-3">
                                    <button className="btn btn-primary btnshowupload d-block mx-auto" onClick={changeShowUpload}>
                                        {!!showUpload ? (t("btnupload.hide") ?? "Hide") : (t("btnupload.show") ?? "Show")} {t("btnupload.upload") ?? "Upload"}
                                    </button>

                                    {!!showUpload && (
                                        <select className={"form-control frmselectupload w-auto d-block mx-auto mt-3 "} value={typeUpload ?? "single"} onChange={changeTypeUpload}>
                                            <option value="" disabled>
                                                {t("seltypeupload.title") ?? "Select Upload Type"}
                                            </option>
                                            <option value={"single"}>
                                                {t("seltypeupload.options.single") ?? "Single"}
                                            </option>
                                            <option value={"multiple"}>
                                                {t("seltypeupload.options.multiple") ?? "Multiple"}
                                            </option>
                                            <option value={"dragndrop"}>
                                                {t("seltypeupload.options.dragndrop") ?? "Drag and Drop"}
                                            </option>
                                        </select>
                                    )}

                                    <div className="mt-3 col-12 mx-auto text-center">
                                        {!!showUpload && (
                                            <>
                                                {!typeUpload || typeUpload === "single" && (
                                                    <FileSingleUploadForm />
                                                )}

                                                {typeUpload === "multiple" && (
                                                    <FileMultiUploadForm />
                                                )}

                                                {typeUpload === "dragndrop" && (
                                                    <FileDragDropUploadForm />
                                                )}
                                            </>
                                        )}

                                        <UploadedFiles />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>
                                        {tbtn("btnback") ?? "Back"}
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

export default withAuth(AdminMedia, onlyAdmins);