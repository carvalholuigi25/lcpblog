/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { delFromStorage, getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getImagePath } from "@/app/[locale]/functions/functions";
import { getConfigSync } from "@/app/[locale]/utils/config";

export interface AdminSidebarProps {
    sidebarStatus: boolean;
    toggleSidebar: any;
    locale: string;
    onClose: (e?: any) => void;
}

export interface AdminSidebarLinksProps {
    id: number;
    name: string;
    link: string;
    icon?: string;
    sublinks?: AdminSidebarSubLinksProps[];
}

export interface AdminSidebarSubLinksProps {
    id: number;
    name: string;
    link: string;
    icon?: string;
}

export const links = (t: any): AdminSidebarLinksProps[] => {
    return [
        {
            id: 0,
            name: t("homelink") ?? "Home",
            link: "/",
            icon: "bi-house",
            sublinks: []
        },
        {
            id: 1,
            name: t("postslink") ?? "Posts",
            link: "/posts",
            icon: "bi-file-post",
            sublinks: []
        },
        {
            id: 2,
            name: t("userslink") ?? "Users",
            link: "/users",
            icon: "bi-people",
            sublinks: []
        },
        {
            id: 3,
            name: t("categorieslink") ?? "Categories",
            link: "/categories",
            icon: "bi-card-list",
            sublinks: []
        },
        {
            id: 4,
            name: t("tagslink") ?? "Tags",
            link: "/tags",
            icon: "bi-tag",
            sublinks: []
        },
        {
            id: 5,
            name: t("media.title") ?? "Media",
            link: "/",
            icon: "bi-collection-play",
            sublinks: [
                {
                    id: 1,
                    name: t("media.options.uploadfileslink") ?? "Upload files",
                    link: "/media",
                    icon: "bi-cloud-upload-fill"
                },
                {
                    id: 2,
                    name: t("media.options.videoslink") ?? "Videos",
                    link: "/videos",
                    icon: "bi-file-earmark-play"
                }
            ]
        },
        {
            id: 6,
            name: t("developers.title") ?? "Developers",
            link: "/developers",
            icon: "bi-file-code",
            sublinks: [
                {
                    id: 1,
                    name: t("developers.options.commitslink") ?? "Commits log",
                    link: "/commitslog",
                    icon: "bi-journal-richtext"
                }
            ]
        },
        {
            id: 7,
            name: t("settingslink") ?? "Settings",
            link: "/settings",
            icon: "bi-gear-fill",
            sublinks: []
        }
    ];
};

export default function AdminSidebarDashboard({ sidebarStatus, toggleSidebar, locale, onClose }: AdminSidebarProps) {
    const t = useTranslations('ui.offcanvasAdmin');
    const pathname = usePathname();
    const prefix = "/pages/admin/dashboard";

    const [logInfo, setLogInfo] = useState("");
    
    const [isSidebarSmall, showisSidebarSmall] = useState(false);
    const showTooltips = isSidebarSmall;
    const isSidebarSmallEnabled = true;
    const isAnimated = true;
    const animType = "original";
    const isRounded = getConfigSync().isBordered;
    const sidebarRef = useRef<any>(null);

    const mlinks: any = [];
    let msublinks: any = [];
    
    const close = useCallback((event: any) => {
        event.preventDefault();

        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        if (sidebarRef.current) {
            sidebarRef.current.focus();
        }
    }, [logInfo]);

    const toggleisSidebarSmall = (e: any) => {
        e.preventDefault();
        showisSidebarSmall(!isSidebarSmall);
    }

    const getIsActive = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? " active" : pathname.endsWith(prefix + x.link) ? (i == x.id ? " active" : "") : pathname.endsWith("/") ? " active" : "";
    }

    const getIsActiveSublink = (y: any) => {
        return pathname.includes(y.link) ? "active" : "";
    }

    const getIsPageCurrent = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? "page" : pathname.endsWith(prefix + x.link) ? (i == x.id ? "page" : "true") : pathname.endsWith("/") ? "page" : "true";
    }

    const getUserId = () => {
        return logInfo ? JSON.parse(logInfo)[0].id : "0";
    }

    const getDisplayName = () => {
        return logInfo ? JSON.parse(logInfo)[0].displayName : "guest";
    }

    const handleLogout = () => {
        if (logInfo) {
            delFromStorage("logInfo");
            setLogInfo("");
        }
    }

    const getUserAvatar = () => {
        return logInfo ? JSON.parse(logInfo)[0].avatar : "avatars/guest.png";
    }

    const renderTooltip = (text: string) => {
        return <Tooltip id="button-tooltip">{text}</Tooltip>;
    };

    const trim = (str: string) => {
        return str.replace("//", "/");
    }

    const navanimstatuscl = sidebarStatus ? (!isAnimated ? " hidden" : " closed") : " open";
    const slideanimposleft = animType.toLowerCase() == "custom" ? " animate__fadeInLeft" : " slideleft";
    const slideanimposright = animType.toLowerCase() == "custom" ? " animate__fadeInRight" : " slideright";
    const animprefix = (animType.toLowerCase() == "custom" ? " animate__animated" : " anim");
    const slideanim = isAnimated ? (isSidebarSmall ? slideanimposleft : slideanimposright) : "";
    const navanimcl = isAnimated ? animprefix + (isSidebarSmall ? " smsbar" : "") + slideanim + navanimstatuscl : (isSidebarSmall ? " smsbar" + navanimstatuscl : (!sidebarStatus ? " open" : " hidden"));
    const roundedcl = isRounded ? " rounded" : "";

    links(t).map((x, i) => {
        const isActive = getIsActive(pathname, prefix, i, x);
        const isPageCurrent = getIsPageCurrent(pathname, prefix, i, x);

        if (x.sublinks && x.sublinks!.length > 0) {
            msublinks = [];

            x.sublinks.map((y, j) => {
                const isActiveSublink = getIsActiveSublink(y);

                msublinks.push(
                    <li key={"sublink" + j}>
                        {showTooltips ? (
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip(y.name)}
                            >
                                <Link className={"dropdown-item sublink " + isActiveSublink} aria-current={isPageCurrent} href={trim(prefix + x.link + y.link)} locale={locale ?? getDefLocale()}>
                                    <i className={"bi " + y.icon + " me-2"}></i>
                                    <span className={"navlinkname" + (isSidebarSmall ? " hidden" : "")}>{y.name}</span>
                                </Link>
                            </OverlayTrigger>
                        ) : (
                            <Link className={"dropdown-item sublink " + isActiveSublink} aria-current={isPageCurrent} href={trim(prefix + x.link + y.link)} locale={locale ?? getDefLocale()}>
                                <i className={"bi " + y.icon + " me-2"}></i>
                                <span className={"navlinkname" + (isSidebarSmall ? " hidden" : "")}>{y.name}</span>
                            </Link>
                        )}
                    </li>
                );
            });

            mlinks.push(
                <li className="nav-item dropdown mysublinks" key={i}>
                    {showTooltips ? (
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(x.name)}
                        >
                            <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className={"bi " + x.icon + " me-2"}></i>
                                <span className={"navlinkname" + (isSidebarSmall ? " hidden" : "")}>{x.name}</span>
                            </button>
                        </OverlayTrigger>
                    ) : (
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className={"bi " + x.icon + " me-2"}></i>
                            <span className={"navlinkname" + (isSidebarSmall ? " hidden" : "")}>{x.name}</span>
                        </button>
                    )}

                    <ul className="dropdown-menu">
                        {msublinks}
                    </ul>
                    <div className="clearfix"></div>
                </li>
            );
        } else {
            mlinks.push(
                <li className="nav-item" key={i}>
                    {showTooltips ? (
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(x.name)}
                        >
                            <Link className={"nav-link" + isActive} aria-current={isPageCurrent} href={trim(prefix + x.link)} locale={locale ?? getDefLocale()}>
                                <i className={"bi " + x.icon + " me-2"}></i>
                                <span className={"navlinkname" + (isSidebarSmall ? " hidden" : "")}>{x.name}</span>
                            </Link>
                        </OverlayTrigger>
                    ) : (
                        <Link className={"nav-link" + isActive} aria-current={isPageCurrent} href={trim(prefix + x.link)} locale={locale ?? getDefLocale()}>
                            <i className={"bi " + x.icon + " me-2"}></i>
                            <span className={"navlinkname" + (isSidebarSmall ? " hidden" : "")}>{x.name}</span>
                        </Link>
                    )}
                </li>
            );
        }
    });

    return ( 
        <ul ref={sidebarRef} className={"nav flex-column nav-pills fixed-top " + astyles.navlinksadmdb + roundedcl + navanimcl} id="navlinksadmdb" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-hidden={!!sidebarStatus ? "true" : "false"} role="dialog" onMouseOver={close} onKeyDown={close}>
            <li className={"nav-item mnavbrand d-flex justify-content-between align-items-center mb-3"}>
                <Link className={"navbar-brand" + (isSidebarSmall ? " hidden" : "")} href="/" locale={locale ?? getDefLocale()}>
                    <Image src={getImagePath("logos/logosm.svg")} alt={"LCPBlog's logo"} width={100} height={100} className="card-img-top img-fluid logosm" />
                </Link>
                <button type="button" className={"nav-link " + astyles.btnshside + " btnclosenav"} onClick={toggleSidebar} title={t("btnclose") ?? "Close"}>
                    {!!sidebarStatus ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
                </button>
            </li>
            {mlinks}
            <li className="nav-item">
                {!!logInfo && (
                    <>
                        <div className={astyles.navlinkalogin + " d-flex justify-content-between align-items-center nav-link mynavlinkalogin p-3"}>
                            <Link href={"/pages/users/" + getUserId()} locale={locale ?? getDefLocale()}>
                                <Image src={"/images/" + getUserAvatar()} width="30" height="30" alt="user" className={astyles.imgavatarheader} />
                                <span>{getDisplayName()}</span>
                            </Link>

                            <button className={`btn ${astyles.btnatp} btn-rounded`} onClick={handleLogout} title={t("logoutlink") ?? "Logout"}>
                                <i className="bi bi-door-closed"></i>
                            </button>
                        </div>
                    </>
                )}
            </li>
            <li className={"nav-item shfixed " + (!isSidebarSmallEnabled ? "hidden" : "")}>
                <button className={"btn btn-rounded"} onClick={toggleisSidebarSmall}>
                    <i className={"bi " + (!isSidebarSmall ? "bi-dash-lg" : "bi-plus-lg")}></i>
                </button>
            </li>
        </ul>
    );
}