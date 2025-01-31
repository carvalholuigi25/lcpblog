"use client";
import { getFromStorage } from "@/app/hooks/localstorage";
import { useEffect, useState } from "react";
import styles from "@/app/page.module.scss";
import Link from "next/link";

export default function AdminUsers() {
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        setLoading(false);
    }, [logInfo, isAuthorized]);

    if (loading) {
        return (
            <div className={styles.padmdashboard}>
                <div className='container-fluid'>
                    <div className='row justify-content-center align-items-center p-3'>
                        <div className='col-12 card p-3 text-center'>
                            <div className='card-body'>
                                <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
                                <p>Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.padmdashboard}>
            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className="col-12 col-md-3 col-lg-2">
                                <ul className="nav flex-column nav-pills">
                                    <li className="nav-item">
                                        <a className="nav-link" href="/pages/admin/dashboard">
                                            <i className="bi bi-house me-2"></i>
                                            Home
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/pages/admin/dashboard/posts">
                                            <i className="bi bi-file-post me-2"></i>
                                            Posts
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/pages/admin/dashboard/users">
                                            <i className="bi bi-people me-2"></i>
                                            Users
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-9 col-lg-10">
                                <h3 className="text-center">
                                    <i className="bi bi-people me-2"></i>
                                    Users
                                </h3>
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded">Back</Link>
                                </div>
                            </div>
                        </>
                    )} 

                    {!isAuthorized && (
                        <div className="col-12">
                            <div className="card mx-auto">
                                <div className="card-body text-center">
                                    <i className="bi bi-exclamation-triangle" style={{fontSize: "4rem"}} />
                                    <h3>Warning</h3>
                                    <p>You are not authorized to view this page!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}