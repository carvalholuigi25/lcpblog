/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePathname } from "next/navigation";
import {Link} from '@/app/i18n/navigation';
import astyles from "@applocale/styles/adminstyles.module.scss";
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
        }
    ];

    const mlinks: any = [];
    const prefix = "/pages/admin/dashboard";
    const pathname = usePathname();
    const showIconName = false;

    const getIsActive = (pathname: string, prefix: string, i: number, x: any) => {
        return pathname.includes(prefix) && i == 0 ? "active" : (pathname.includes(prefix + x.link) ? "active" : "");
    }

    const getIsPageCurrent = (pathname: string, prefix: string, i: number, x: any) => {
        return pathname.includes(prefix) && i == 0 ? "page" : (pathname.includes(prefix + x.link) ? "page" : "true");
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