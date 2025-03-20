/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import {Link} from '@/app/i18n/navigation';
import Image from "next/image";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

export default function AdminNavbarDashboard({logInfo, sidebarToggle, toggleSidebar, locale}: {logInfo: string, sidebarToggle: boolean, toggleSidebar: any, locale: string}) {
    const getUserId = () => {
        return logInfo ? JSON.parse(logInfo)[0].id : "0";
    }

    const getAvatar = () => {
        return logInfo ? JSON.parse(logInfo)[0].avatar : "avatars/guest.png";
    }

    const getDisplayName = () => {
        return logInfo ? JSON.parse(logInfo)[0].displayName : "guest";
    }

    return (
        <nav className={"navbar navbar-expand-lg bg-body-tertiary " + astyles.navbartopadmdb} id="navbartopadmdb">
            <div className="container-fluid">
                <Link className={"navbar-brand"} href="/" locale={locale ?? getDefLocale()}>LCPBlog</Link>

                <div className="navbar-nav me-auto">
                    <div className={!sidebarToggle ? "hidden" : "d-flex justify-content-center"}>
                        <button type="button" className={"nav-link " + astyles.btnshsidebynav} onClick={toggleSidebar}>
                            {!!sidebarToggle ? <i className="bi bi-list"></i> : <i className="bi bi-x-lg"></i>}
                        </button>
                    </div>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarAdmDashboard" aria-controls="navbarAdmDashboard" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="bi-list"></i>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarAdmDashboard">
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link active" aria-current="page" href={"/pages/users/" + getUserId()} locale={locale ?? getDefLocale()}>
                            <Image src={'/images/' + getAvatar()} width={40} height={40} className={astyles.imgavatar + " me-3"} alt={getDisplayName() + "'s Avatar"} />
                            <span className="hidden">{getDisplayName()}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}