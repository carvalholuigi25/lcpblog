/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getFromStorage } from "@/app/hooks/localstorage";
import { useEffect, useState } from "react";
import { Posts } from "@/app/interfaces/posts";
import astyles from "@/app/adminstyles.module.scss";
import FetchData from "@/app/utils/fetchdata";
import AdminSidebarDashboard from "@/app/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@/app/components/admin/dashboard/adbnavbar";
import TableData from "@/app/components/admin/dashboard/tabledata";
import Link from "next/link";

export default function AdminPosts() {
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState(new Array<Posts>());
    const [sidebarToggle, setSidebarToggle] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            const data = await FetchData({
                url: 'api/posts',
                method: 'get',
                reqAuthorize: false
            });

            if (data.data) {
                setPosts(JSON.parse(JSON.stringify(data.data)));
                setLoading(false);
            }
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        fetchPosts();
    }, [logInfo, isAuthorized]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
                <div className='container-fluid'>
                    <div className='row justify-content-center align-items-center p-3'>
                        <div className='col-12 card p-3 text-center'>
                            <div className='card-body'>
                                <i className="bi bi-clock" style={{ fontSize: "4rem" }}></i>
                                <p>Loading...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setSidebarToggle(!sidebarToggle);
    }

    const tableHeaders = [
        { dataIndex: 'postId', title: 'Post Id' },
        { dataIndex: 'title', title: 'Title' },
        { dataIndex: 'content', title: 'Content' },
        { dataIndex: 'createdAt', title: 'Created At' },
        { dataIndex: 'updatedAt', title: 'Updated At' },
        { dataIndex: 'userId', title: 'User Id' },
    ];

    return (
        <div className={astyles.admdashboard}>
            {!!isAuthorized && (
                <AdminNavbarDashboard logInfo={logInfo} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                <AdminSidebarDashboard sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
                            </div>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "9" : "12") + " col-lg-" + (!sidebarToggle ? "10" : "12") + ""}>
                                <h3 className="text-center">
                                    <i className="bi bi-file-post me-2"></i>
                                    Posts
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        {!!posts && (
                                            <div className="col-12">
                                                <TableData theaders={tableHeaders} tdata={posts} />
                                            </div>
                                        )}

                                        {!posts && (
                                            <div className='col-12 card p-3 text-center'>
                                                <div className='card-body'>
                                                    <i className="bi bi-file-post" style={{ fontSize: "4rem" }}></i>
                                                    <p>0 posts</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded">Back</Link>
                                </div>
                            </div>
                        </>
                    )}

                    {!isAuthorized && (
                        <div className="col-12 mt-3">
                            <div className="card mx-auto">
                                <div className="card-body text-center">
                                    <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem" }} />
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