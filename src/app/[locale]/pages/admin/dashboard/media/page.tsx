/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import { useLocale } from "next-intl";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import FileSingleUploadForm from "@applocale/components/forms/upload/singleupload";
import FileMultiUploadForm from "@applocale/components/forms/upload/multiupload";
import UploadedFiles from "@applocale/components/uploadedfiles";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import FileDragDropUploadForm from "@/app/[locale]/components/forms/upload/dragdropupload";
import LoadingComp from "@/app/[locale]/components/loadingcomp";

const AdminMedia = () => {
    const locale = useLocale();
    const [logInfo, setLogInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(true);
    const [typeUpload, setTypeUpload] = useState("single");
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
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

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setSidebarToggle(!sidebarToggle);
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
                                    <i className="bi bi-cloud-upload-fill me-2"></i>
                                    Upload Files
                                </h3>

                                <div className="container p-3">
                                    <button className="btn btn-primary btnshowupload d-block mx-auto" onClick={changeShowUpload}>
                                        {!!showUpload ? "Hide" : "Show"} upload
                                    </button>

                                    {!!showUpload && (
                                        <select className={"form-control frmselectupload w-auto d-block mx-auto mt-3 "} value={typeUpload} onChange={changeTypeUpload}>
                                            <option value="" disabled>Select upload type</option>
                                            <option value={"single"}>Single</option>
                                            <option value={"multiple"}>Multiple</option>
                                            <option value={"dragndrop"}>Drag and Drop</option>
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

export default withAuth(AdminMedia, ["admin"]);