/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import astyles from "@/app/adminstyles.module.scss";

export default function AdminSidebarDashboard({sidebarToggle, toggleSidebar}: {sidebarToggle: boolean, toggleSidebar: any}) {    
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

    const getIsActive = (pathname: string, prefix: string, i: number, x: any) => {
        return pathname === prefix && i == 0 ? "active" : (pathname == prefix + x.link ? "active" : "");
    }

    const getIsPageCurrent = (pathname: string, prefix: string, i: number, x: any) => {
        return pathname === prefix && i == 0 ? "page" : (pathname == prefix + x.link ? "page" : "true");
    }

    links.map((x, i) => {
        const isActive = getIsActive(pathname, prefix, i, x);
        const isPageCurrent = getIsPageCurrent(pathname, prefix, i, x);
        
        mlinks.push(
            <li className="nav-item" key={i}>
                <Link className={"nav-link " + isActive} aria-current={isPageCurrent} href={prefix+x.link}>
                    <i className={"bi " + x.icon + " me-2"}></i>
                    {x.name}
                </Link>
            </li>
        );
    });

    return (
        <ul className={"nav flex-column nav-pills " + astyles.navlinksadmdb + (sidebarToggle ? " hidden" : "")}>
            <li className={"nav-item d-flex justify-content-between align-items-center mb-3"}>
                <Link className={"navbar-brand"} href="/">LCPBlog</Link>
                <button type="button" className={"nav-link " + astyles.btnshside} onClick={toggleSidebar}>
                    {!!sidebarToggle ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
                </button>
            </li>
            {mlinks}
        </ul>
    );
}