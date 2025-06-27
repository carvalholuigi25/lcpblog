/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { Suspense, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { onlyAdmins } from "@applocale/functions/functions";
import { Media } from "@applocale/interfaces/media";
import { VideoJsOptions } from "@applocale/interfaces/videoplayer";
import { useParams } from "next/navigation";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("@applocale/components/ui/video/player"), {
  ssr: false, // Disable SSR for this component
});

const videoJsOptions: VideoJsOptions = {
    controls: true,
    autoplay: false,
    responsive: true,
    posterImage: true,
    fluid: true,
    preload: 'auto',
    sources: [{}]
};

const AdminVideosById = () => {
    const locale = useLocale();
    const {mediaId} = useParams();
    const t = useTranslations("pages.AdminPages.VideosPage");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [barToggle, setBarToggle] = useState(true);
    const [videos, setVideos] = useState(new Array<Media>());

  

    useEffect(() => {
       async function fetchVideos() {
            const data = await FetchDataAxios({
                url: 'api/medias/'+mediaId,
                method: 'get',
                reqAuthorize: process.env.NODE_ENV === "production" ? true : false
            });

            const ndata: Media[] = [];

            if(data.data) {
                ndata.push(data.data);
                setVideos(ndata);
            }
        }
       
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }
       
        setIsAuthorized(logInfo && onlyAdmins.includes(JSON.parse(logInfo)[0].role) ? true : false);
        fetchVideos();
        setLoading(false);
    }, [logInfo, isAuthorized, mediaId]);

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
                                    <i className="bi bi-file-earmark-play me-2"></i>
                                    {t("title") ?? "Videos"}
                                </h3>
                                <div className="container mt-3">
                                    <div className="row">
                                        {!videos && (
                                            <div className='col-12 card p-3 mt-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-file-earmark-play" style={{ fontSize: "4rem" }}></i>
                                                    <p>{t("emptyvideos") ?? "0 videos"}</p>
                                                </div>
                                            </div>
                                        )}

                                        {videos && (
                                            <div className="col-12">
                                                <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                                                    {videos.map((x, i) => (
                                                        <VideoPlayer key={i} id={parseInt(""+x.mediaId)} src={x.src} type={x.typeMime} poster={x.thumbnail!} options={videoJsOptions} />
                                                    ))}
                                                </Suspense>
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

export default withAuth(AdminVideosById, onlyAdmins);