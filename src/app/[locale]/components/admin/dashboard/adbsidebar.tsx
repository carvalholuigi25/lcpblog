/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { useEffect, useState } from "react";
import { delFromStorage, getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export interface AdminSidebarProps {
    sidebarToggle: boolean;
    toggleSidebar: any;
    locale: string;
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
            name: t("medialink") ?? "Media",
            link: "/media",
            icon: "bi-cloud-upload-fill",
            sublinks: []
        },
        {
            id: 4,
            name: t("categorieslink") ?? "Categories",
            link: "/categories",
            icon: "bi-card-list",
            sublinks: []
        },
        {
            id: 5,
            name: t("developers.title") ?? "Developers",
            link: "/developers",
            icon: "bi-gear-fill",
            sublinks: [
                {
                    id: 1,
                    name: t("developers.option.commitslink") ?? "Commits log",
                    link: "/commitslog",
                    icon: "bi-journal-richtext"
                }
            ]
        },
        {
            id: 6,
            name: t("videoslink") ?? "Videos",
            link: "/videos",
            icon: "bi-file-earmark-play",
            sublinks: []
        }
    ];
};

export default function AdminSidebarDashboard({ sidebarToggle, toggleSidebar, locale }: AdminSidebarProps) {
    const t = useTranslations('ui.offcanvasAdmin');
    const pathname = usePathname();
    const [logInfo, setLogInfo] = useState("");
    const prefix = "/pages/admin/dashboard";

    const showIconName = false;
    const mlinks: any = [];
    let msublinks: any = [];

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }
    }, [logInfo]);

    const getIsActive = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? " active" : pathname.endsWith(prefix + x.link) ? (i == x.id ? " active" : "") : pathname.endsWith("/") ? " active" : "";
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

    links(t).map((x, i) => {
        const isActive = getIsActive(pathname, prefix, i, x);
        const isPageCurrent = getIsPageCurrent(pathname, prefix, i, x);

        if (x.sublinks && x.sublinks!.length > 0) {
            msublinks = [];

            x.sublinks.map((y, j) => {
                msublinks.push(
                    <li key={"sublink" + j}>
                        <Link className={"dropdown-item sublink " + isActive} aria-current={isPageCurrent} href={prefix + x.link + y.link} locale={locale ?? getDefLocale()}>
                            <i className={"bi " + y.icon + " me-2"}></i>
                            <span className={"navlinkname" + (showIconName ? " hidden" : "")}>{y.name}</span>
                        </Link>
                    </li>
                );
            });

            mlinks.push(
                <li className="nav-item dropdown mysublinks" key={i}>
                    <button className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className={"bi " + x.icon + " me-2"}></i>
                        <span className={"navlinkname" + (showIconName ? " hidden" : "")}>{x.name}</span>
                    </button>
                    <ul className="dropdown-menu">
                        {msublinks}
                    </ul>
                    <div className="clearfix"></div>
                </li>
            );
        } else {
            mlinks.push(
                <li className="nav-item" key={i}>
                    <Link className={"nav-link" + isActive} aria-current={isPageCurrent} href={prefix + x.link} locale={locale ?? getDefLocale()}>
                        <i className={"bi " + x.icon + " me-2"}></i>
                        <span className={"navlinkname" + (showIconName ? " hidden" : "")}>{x.name}</span>
                    </Link>
                </li>
            );
        }
    });

    return (
        <ul className={"nav flex-column nav-pills " + astyles.navlinksadmdb + (sidebarToggle ? " hidden" : "") + (showIconName ? " w-auto" : "")} id="navlinksadmdb">
            <li className={"nav-item d-flex justify-content-between align-items-center mb-3"}>
                <Link className={"navbar-brand" + (showIconName ? " hidden" : "")} href="/" locale={locale ?? getDefLocale()}>LCPBlog</Link>
                <button type="button" className={"nav-link " + astyles.btnshside} onClick={toggleSidebar} title={t("btnclose") ?? "Close"}>
                    {!!sidebarToggle ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
                </button>
            </li>
            {mlinks}
            <li className="nav-item">
                {!!logInfo && (
                    <>
                        <div className={astyles.navlinkalogin + " d-flex justify-content-between align-items-center nav-link p-3"}>
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
        </ul>
    );
}