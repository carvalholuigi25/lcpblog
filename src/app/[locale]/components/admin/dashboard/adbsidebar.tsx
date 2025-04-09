/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { Link } from '@/app/i18n/navigation';
import { usePathname } from "next/navigation";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

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

export const links: AdminSidebarLinksProps[] = [
    {
        id: 0,
        name: "Home",
        link: "/",
        icon: "bi-house",
        sublinks: []
    },
    {
        id: 1,
        name: "Posts",
        link: "/posts",
        icon: "bi-file-post",
        sublinks: []
    },
    {
        id: 2,
        name: "Users",
        link: "/users",
        icon: "bi-people",
        sublinks: []
    },
    {
        id: 3,
        name: "Media",
        link: "/media",
        icon: "bi-cloud-upload-fill",
        sublinks: []
    },
    {
        id: 4,
        name: "Categories",
        link: "/categories",
        icon: "bi-card-list",
        sublinks: []
    },
    {
        id: 5,
        name: "Developers",
        link: "/developers",
        icon: "bi-gear-fill",
        sublinks: [
            {
                id: 1,
                name: "Commits log",
                link: "/commitslog",
                icon: "bi-journal-richtext"
            }
        ]
    }
];

export default function AdminSidebarDashboard({ sidebarToggle, toggleSidebar, locale }: AdminSidebarProps) {
    const prefix = "/pages/admin/dashboard";
    const pathname = usePathname();
    const showIconName = false;
    const mlinks: any = [];
    let msublinks: any = [];

    const getIsActive = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? "active" : pathname.endsWith(prefix + x.link) ? (i == x.id ? "active" : "") : pathname.endsWith("/") ? "active" : "";
    }

    const getIsPageCurrent = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? "page" : pathname.endsWith(prefix + x.link) ? (i == x.id ? "page" : "true") : pathname.endsWith("/") ? "page" : "true";
    }

    links.map((x, i) => {
        const isActive = getIsActive(pathname, prefix, i, x);
        const isPageCurrent = getIsPageCurrent(pathname, prefix, i, x);

        if (x.sublinks && x.sublinks!.length > 0) {
            msublinks = [];

            x.sublinks.map((y, j) => {
                msublinks.push(
                    <li className="nav-item" key={"sublink" + j}>
                        <Link className={"nav-link dropdown-item sublink " + isActive} aria-current={isPageCurrent} href={prefix + x.link + y.link} locale={locale ?? getDefLocale()}>
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
                </li>
            );
        } else {
            mlinks.push(
                <li className="nav-item" key={i}>
                    <Link className={"nav-link " + isActive} aria-current={isPageCurrent} href={prefix + x.link} locale={locale ?? getDefLocale()}>
                        <i className={"bi " + x.icon + " me-2"}></i>
                        <span className={"navlinkname" + (showIconName ? " hidden" : "")}>{x.name}</span>
                    </Link>
                </li>
            );
        }
    });

    return (
        <ul className={"nav flex-column nav-pills " + astyles.navlinksadmdb + (sidebarToggle ? " hidden " : " ") + (showIconName ? " w-auto" : "")} id="navlinksadmdb">
            <li className={"nav-item d-flex justify-content-between align-items-center mb-3"}>
                <Link className={"navbar-brand" + (showIconName ? " hidden" : "")} href="/" locale={locale ?? getDefLocale()}>LCPBlog</Link>
                <button type="button" className={"nav-link " + astyles.btnshside} onClick={toggleSidebar}>
                    {!!sidebarToggle ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
                </button>
            </li>
            {mlinks}
        </ul>
    );
}