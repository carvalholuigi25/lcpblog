/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import astyles from "@/app/adminstyles.module.scss";

export default function AdminSidebarDashboard({sidebarToggle, toggleSidebar}: {sidebarToggle: boolean, toggleSidebar: any}) {
    const pathname = usePathname();
    
    const links = [
        {
            name: "Home",
            link: "dashboard",
            icon: "bi-house"
        },
        {
            name: "Posts",
            link: "dashboard/posts",
            icon: "bi-file-post"
        },
        {
            name: "Users",
            link: "dashboard/users",
            icon: "bi-people"
        }
    ];

    const mlinks: any = [];
    const prefix = "/pages/admin/";
    const isActive = pathname == prefix + "/dashboard" ? "active" : "";
    const isPageCurrent = pathname == prefix + "/dashboard" ? "page" : "true";

    links.map((x, i) => (
        mlinks.push(
            <li className="nav-item" key={i}>
                <Link className={"nav-link " + isActive} aria-current={isPageCurrent} href={prefix + x.link}>
                    <i className={"bi " + x.icon + " me-2"}></i>
                    {x.name}
                </Link>
            </li>
        )
    ));

    return (
        <ul className={"nav flex-column nav-pills " + astyles.navlinksadmdb + (sidebarToggle ? " hidden" : "")}>
            <li className="nav-item d-flex justify-content-end align-items-center">
                <button type="button" className={"nav-link " + astyles.btnshside} onClick={toggleSidebar}>
                    {!!sidebarToggle ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
                </button>
            </li>
            {mlinks}
        </ul>
    );
}