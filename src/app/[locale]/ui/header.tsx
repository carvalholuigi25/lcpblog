"use client";
import styles from "@applocale/page.module.scss";
import React, { useEffect, useState } from 'react';
import { delFromStorage, getFromStorage } from '@applocale/hooks/localstorage';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { Link } from '@/app/i18n/navigation';
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from 'next/dynamic';
import LoadingComp from "@applocale/components/loadingcomp";

const SearchComponent = dynamic(() => import('./search'), { ssr: false })

const HeaderMenu = ({ locale }: { locale: string }) => {
    const [logInfo, setLogInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadLinkAuth, setLoadLinkAuth] = useState(false);
    const t = useTranslations('ui.offcanvas');

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setLoadLinkAuth(!logInfo ? true : false);
        setLoading(false);
    }, [logInfo]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const getDisplayName = () => {
        return logInfo ? JSON.parse(logInfo)[0].displayName : null;
    };

    const getUserId = () => {
        return logInfo ? JSON.parse(logInfo)[0].id : 1;
    };

    const getUserAvatar = () => {
        return logInfo ? JSON.parse(logInfo)[0].avatar : "avatars/guest.png";
    };

    const getUserRole = () => {
        return logInfo ? JSON.parse(logInfo)[0].role : "guest";
    }

    const handleLogout = () => {
        if (logInfo) {
            delFromStorage("logInfo");
            setLogInfo("");
        }
    };

    return (
        <div className="offcanvas offcanvas-start" tabIndex={-1} id="menuHeader" aria-labelledby="menuHeaderLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="menuHeaderLabel">LCPBlog</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label={t("btnclose") ?? "Close"} title={t("btnclose") ?? "Close"}></button>
            </div>
            <div className="offcanvas-body">
                <div className="mysuboffcanvas">
                    <Link className="nav-link active p-3" aria-current="page" href="/#home" locale={locale ?? getDefLocale()}>
                        <i className="bi bi-house me-2"></i>
                        {t("homelink") ?? "Home"}
                    </Link>

                    {!!loadLinkAuth && (
                        <Link className="nav-link navlinklogin p-3" aria-current="page" href={"/auth/login"} locale={locale ?? getDefLocale()}>
                            <i className="bi bi-person-circle me-2"></i>
                            <span>
                                {t("loginlink") ?? "Login"}
                            </span>
                        </Link>
                    )}

                    {!!logInfo && (
                        <>
                            {getUserRole() == "admin" && (
                                <Link href={"/pages/admin/dashboard"} locale={locale ?? getDefLocale()} className='nav-link p-3'>
                                    <i className="bi bi-speedometer me-2"></i>
                                    <span>{t("dashboardlink") ?? "Dashboard"}</span>
                                </Link>
                            )}

                            <div className="d-flex justify-content-between align-items-center nav-link navlinklogin p-3">
                                <Link href={"/pages/users/" + getUserId()} locale={locale ?? getDefLocale()}>
                                    <Image src={"/images/" + getUserAvatar()} width="30" height="30" alt="user" className={styles.imgavatarheader} />
                                    <span>{getDisplayName()}</span>
                                </Link>

                                <button className='btn btn-tp btn-rounded' onClick={handleLogout} title={t("logoutlink") ?? "Logout"}>
                                    <i className="bi bi-door-closed"></i>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const Header = ({ locale }: { locale: string }) => {
    return (
        <>
            <HeaderMenu locale={locale ?? getDefLocale()} />
            <div className='header'>
                <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand" href="/#home" locale={locale ?? getDefLocale()}>
                            LCP Blog
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarMain"
                            aria-controls="navbarMain"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarMain">
                            <ul className="navbar-nav mx-auto me-0">
                                <li className="nav-item">
                                    <SearchComponent />
                                </li>
                            </ul>
                            <ul className="navbar-nav ms-auto me-0">
                                <li className="nav-item">
                                    <button className="btn btn-tp btn-rounded" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuHeader" aria-controls="menuHeader">
                                        <i className="bi bi-gear"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>

    );
};

export default Header;