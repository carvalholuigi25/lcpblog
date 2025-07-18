/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { useState } from "react";
import { getDefLocale } from "@applocale/helpers/defLocale";
import {Link} from '@/app/i18n/navigation';
import { getImagePath } from "@/app/[locale]/functions/functions";
import { getConfigSync } from "@/app/[locale]/utils/config";

export interface AdminNavbarProps {
    logInfo: string;
    navbarStatus: boolean;
    toggleNavbar: any;
    locale: string;
}

export default function AdminNavbarDashboard({logInfo, navbarStatus, toggleNavbar, locale}: AdminNavbarProps) {
    const isRounded = getConfigSync().isBordered;
    const roundedCl = isRounded ? " roundednavbar" : "";
    const [isNavbarToggled, setisNavbarToggled] = useState(false);

    const toggleMainNavbar = () => {
        setisNavbarToggled(!isNavbarToggled)
    }

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
        <nav className={"navbar navbar-expand-lg bg-body-tertiary " + astyles.navbartopadmdb + roundedCl} id="navbartopadmdb">
            <div className="container-fluid">
                <Link className={"navbar-brand"} href="/" locale={locale ?? getDefLocale()}>
                    <Image src={getImagePath("logos/logosm.svg")} alt={"LCPBlog's logo"} width={100} height={100} className="card-img-top img-fluid logosm" />
                </Link>

                <div className="navbar-nav me-auto">
                    <div className={!navbarStatus ? "hidden" : "d-flex justify-content-center"}>
                        <button type="button" className={"nav-link " + astyles.btnshsidebynav} id="btnshsidebynav" onClick={toggleNavbar}>
                            {!!navbarStatus ? <i className="bi bi-list iconav"></i> : <i className="bi bi-x-lg iconav"></i>}
                        </button>
                    </div>
                </div>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarAdmDashboard" aria-controls="navbarAdmDashboard" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleMainNavbar}>
                    <i className={"bi bi-" + (isNavbarToggled ? "x-lg" : "list") + " iconav"}></i>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarAdmDashboard">
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link active" aria-current="page" href={"/pages/users/" + getUserId()} locale={locale ?? getDefLocale()}>
                            <Image src={'/images/' + getAvatar()} width={40} height={40} className={astyles.imgavatar} alt={getDisplayName() + "'s Avatar"} />
                            <span className="hidden ms-3">{getDisplayName()}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}