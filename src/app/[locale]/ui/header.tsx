"use client";
import React, { useEffect, useState } from 'react';
import { delFromStorage, getFromStorage } from '@applocale/hooks/localstorage';
import {Link} from '@/app/i18n/navigation';
import Image from "next/image";
import styles from "@applocale/page.module.scss";
import dynamic from 'next/dynamic';
import { getDefLocale } from '../helpers/defLocale';

const SearchComponent = dynamic(() => import('./search'), { ssr: false })

const HeaderMenu = ({locale}: {locale: string}) => {
    const [logInfo, setLogInfo] = useState("");

    useEffect(() => {
        if(!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }
    }, [logInfo]);

    const getDisplayName = () => {
        return logInfo ? JSON.parse(logInfo)[0].displayName : null;
    };

    const getUserId = () => {
        return logInfo ? JSON.parse(logInfo)[0].id : 1;
    };

    const getUserAvatar = () => {
        return logInfo ? JSON.parse(logInfo)[0].avatar : "guest.png";
    };

    const getUserRole = () => {
        return logInfo ? JSON.parse(logInfo)[0].role : "guest";
    }

    const handleLogout = () => {
        if(logInfo) {
            delFromStorage("logInfo");
            setLogInfo("");
        }
    };

    return (
        <div className="offcanvas offcanvas-start" tabIndex={-1} id="menuHeader" aria-labelledby="menuHeaderLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="menuHeaderLabel">LCPBlog</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="dropdown">
                    <Link className="nav-link active p-3" aria-current="page" href="/#home">
                        <i className="bi bi-house me-2"></i>
                        Home
                    </Link>

                    {!!logInfo && (
                        <>
                            {getUserRole() == "admin" && (
                                <Link href={"/pages/admin/dashboard"} locale={locale ?? getDefLocale()} className='nav-link p-3'>
                                    <i className="bi bi-speedometer me-2"></i>
                                    <span>Dashboard</span>
                                </Link>
                            )}

                            <div className="d-flex justify-content-between align-items-center nav-link navlinklogin p-3">
                                <Link href={"/pages/users/" + getUserId()} locale={locale ?? getDefLocale()}>
                                    <Image src={"/images/"+getUserAvatar()} width="30" height="30" alt="user" className={styles.imgavatarheader} />
                                    <span>{getDisplayName()}</span>
                                </Link>

                                <button className='btn btn-tp btn-rounded' onClick={handleLogout}>
                                    <i className="bi bi-door-closed"></i>
                                </button>
                            </div>
                        </>
                    )}

                    {!logInfo && (
                        <>
                            <Link href={"/auth/login"} locale={locale ?? getDefLocale()} className="nav-link navlinklogin p-3">
                                <i className="bi bi-person-circle me-2"></i>
                                <span>Login</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const Header = ({locale}: {locale: string}) => {
    return (
        <>
            <HeaderMenu locale={locale ?? getDefLocale()} />
            <div className='header'>
                <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand" href="/#home">
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