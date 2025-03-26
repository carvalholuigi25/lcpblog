/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
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

const AdminMedia = () => {
    const locale = useLocale();
    const [logInfo, setLogInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(true);
    const [typeUpload, setTypeUpload] = useState("single");

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
                                    <i className="bi bi-cloud-upload-fill me-2"></i>
                                    Upload Files
                                </h3>

                                <div className="container p-3">
                                    <select className="form-control frmselectupload w-auto d-block mx-auto" value={typeUpload} onChange={(e) => setTypeUpload(e.target.value)}>
                                        <option value="" disabled>Select upload type</option>
                                        <option value={"single"}>Single</option>
                                        <option value={"multiple"}>Multiple</option>
                                    </select>

                                    <div className="mt-3 col-12 mx-auto text-center">
                                        {!typeUpload || typeUpload === "single" && (
                                            <FileSingleUploadForm />
                                        )}

                                        {typeUpload === "multiple" && (
                                            <FileMultiUploadForm />
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