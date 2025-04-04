/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { Link } from '@/app/i18n/navigation';
import { usePathname } from "next/navigation";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

export default function AdminSidebarDashboard({sidebarToggle, toggleSidebar, locale}: {sidebarToggle: boolean, toggleSidebar: any, locale: string}) {    
    const links = [
        {
            id: 0,
            name: "Home",
            link: "/",
            icon: "bi-house"
        },
        {
            id: 1,
            name: "Posts",
            link: "/posts",
            icon: "bi-file-post"
        },
        {
            id: 2,
            name: "Users",
            link: "/users",
            icon: "bi-people"
        },
        {
            id: 3,
            name: "Media",
            link: "/media",
            icon: "bi-cloud-upload-fill"
        },
        {
            id: 4,
            name: "Categories",
            link: "/categories",
            icon: "bi-card-list"
        }
    ];

    const mlinks: any = [];
    const prefix = "/pages/admin/dashboard";
    const pathname = usePathname();
    const showIconName = false;

    const getIsActive = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? "active" : pathname.endsWith(prefix + x.link) ? (i == x.id ? "active" : "") : pathname.endsWith("/") ? "active" : "";
    }

    const getIsPageCurrent = (pathname: string, prefix: string, i: number, x: any) => {
        return x.id == 0 && pathname.endsWith(prefix) ? "page" : pathname.endsWith(prefix + x.link) ? (i == x.id ? "page" : "true") : pathname.endsWith("/") ? "page" : "true";
    }

    links.map((x, i) => {
        const isActive = getIsActive(pathname, prefix, i, x);
        const isPageCurrent = getIsPageCurrent(pathname, prefix, i, x);
        
        mlinks.push(
            <li className="nav-item" key={i}>
                <Link className={"nav-link " + isActive} aria-current={isPageCurrent} href={prefix + x.link} locale={locale ?? getDefLocale()}>
                    <i className={"bi " + x.icon + " me-2"}></i>
                    <span className={"navlinkname" + (showIconName ? " hidden" : "")}>{x.name}</span>
                </Link>
            </li>
        );
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