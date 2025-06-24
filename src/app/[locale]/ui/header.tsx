/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import dynamic from 'next/dynamic';
import styles from "@applocale/page.module.scss";
import React, { useEffect, useState } from 'react';
import { delFromStorage, getFromStorage } from '@applocale/hooks/localstorage';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { Link } from '@/app/i18n/navigation';
import { useTranslations } from "next-intl";
import { LoginStatus, UserSessionsTypes } from "@applocale/interfaces/user";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import ModalSession from "@applocale/components/ui/modals/modalsession";
import * as config from "@applocale/utils/config";
import { getImagePath } from "../functions/functions";

const isRounded = config.getConfigSync().isBordered;
const is3DEffectsEnabled = config.getConfigSync().is3DEffectsEnabled; 
const SearchComponent = dynamic(() => import('./search'), { ssr: false })

const HeaderMenu = ({ logInfo, locale, handleLogout }: { logInfo: any, locale: string, handleLogout: any }) => {
    const t = useTranslations('ui.offcanvas');
    const [loading, setLoading] = useState(true);
    const [loadLinkAuth, setLoadLinkAuth] = useState(false);
    const roundedcl = isRounded ? "rounded" : "";

    useEffect(() => {
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

    return (
        <div className={"offcanvas offcanvas-start " + roundedcl} tabIndex={-1} id="menuHeader" aria-labelledby="menuHeaderLabel">
            <div className="offcanvas-header">
                <div className={"offcanvas-title" + (is3DEffectsEnabled ? " navbar3D" : "")} id="menuHeaderLabel">
                    <Image src={getImagePath("logos/logosm.svg")} alt={"LCPBlog's logo"} width={100} height={100} className="card-img-top img-fluid logosm" />
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label={t("btnclose") ?? "Close"} title={t("btnclose") ?? "Close"}></button>
            </div>
            <div className="offcanvas-body">
                <div className="mysuboffcanvas">
                    <Link className="nav-link active p-3" aria-current="page" href="/#home" locale={locale ?? getDefLocale()}>
                        <i className="bi bi-house me-2"></i>
                        {t("homelink") ?? "Home"}
                    </Link>

                    <Link className="nav-link navlinkarch p-3" aria-current="page" href="/pages/archive" locale={locale ?? getDefLocale()}>
                        <i className="bi bi-archive me-2"></i>
                        {t("archlink") ?? "Archive"}
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

                            <Link href={"/pages/settings"} locale={locale ?? getDefLocale()} className='nav-link p-3'>
                                <i className="bi bi-gear-fill me-2"></i>
                                <span>{t("settingslink") ?? "Settings"}</span>
                            </Link>

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
    const roundedcl = isRounded ? "rounded" : "";
    const [isNavbarToggled, setisNavbarToggled] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [logStatus, setLogStatus] = useState<LoginStatus>();
    const [logInfo, setLogInfo] = useState("");

    useEffect(() => {
        if(!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        if(!logStatus) {
            if(getFromStorage("loginStatus")!) {
                const lso = JSON.parse(getFromStorage("loginStatus")!);

                setLogStatus({
                    loginStatusId: lso.loginStatusId,
                    attempts: lso.attempts,
                    status: lso.status,
                    dateLock: lso.dateLock,
                    dateLockTimestamp: lso.dateLockTimestamp,
                    type: lso.type,
                    modeTimer: lso.modeTimer,
                    valueTimer: lso.valueTimer,
                    userId: lso.userId
                });

                if(lso.status == "unlocked" && lso.attempts == 0 && new Date(lso.valueTimer).getTime() <= new Date().getTime()) {
                    setShowSessionModal(true);
                    // delFromStorage("loginStatus");
                    // delFromStorage("logInfo");
                    // setLogInfo("");
                    // location.reload();
                }
            }
        }
    }, [logInfo, logStatus]);

    const toggleNavbar = () => {
        setisNavbarToggled(!isNavbarToggled)
    }

    const toggleSessionModal = () => {
        setShowSessionModal(!showSessionModal);
    }

    const closeModal = () => {
        setShowSessionModal(false);
    }

    const handleLogout = () => {
        if (logInfo) {
            delFromStorage("logInfo");
            delFromStorage("loginStatus");
            setLogInfo("");
        }
    };

    return (
        <>
            <HeaderMenu logInfo={logInfo} locale={locale ?? getDefLocale()} handleLogout={handleLogout} />
            <div className='header'>
                <nav className={"navbar ps-0 pe-0 navbar-expand-lg bg-body-tertiary fixed-top " + roundedcl}>
                    <div className={"navbar-container"}></div>
                    <div className="container-fluid">
                        <Link className={"navbar-brand" + (is3DEffectsEnabled ? " navbar3D" : "")} href="/#home" locale={locale ?? getDefLocale()}>
                            <Image src={getImagePath("logos/logosm.svg")} alt={"LCPBlog's logo"} width={100} height={100} className="card-img-top img-fluid logosm" />
                        </Link>
                        <button
                            className={"navbar-toggler" + (is3DEffectsEnabled ? " navbartoggler3D" : "")}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarMain"
                            aria-controls="navbarMain"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick={toggleNavbar}
                        >
                            <i className={"bi bi-" + (isNavbarToggled ? "x-lg" : "list")}></i>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarMain">
                            <ul className="navbar-nav mx-auto me-0">
                                <li className="nav-item">
                                    <SearchComponent />
                                </li>
                            </ul>
                            <ul className="navbar-nav ms-auto me-0">
                                <li className="nav-item">
                                    {logInfo && logStatus && logStatus.type == UserSessionsTypes.Temporary.toString() && (
                                        <button className="btn btn-tp btn-rounded btnsessiontime me-2" type="button" onClick={toggleSessionModal}>
                                            <i className="bi bi-clock-fill"></i>
                                        </button>
                                    )}

                                    <button className="btn btn-tp btn-rounded btnshowheader" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuHeader" aria-controls="menuHeader">
                                        <i className="bi bi-gear"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            {showSessionModal && <ModalSession statusModal={showSessionModal} onClose={closeModal} />}
        </>

    );
};

export default Header;