/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getFromStorage } from "@/app/hooks/localstorage";
import { useEffect, useState } from "react";
import { Posts } from "@/app/interfaces/posts";
import astyles from "@/app/adminstyles.module.scss";
import Link from "next/link";
import Image from "next/image";
import FetchData from "@/app/utils/fetchdata";

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

    const getUserId = () => {
        return logInfo ? JSON.parse(logInfo)[0].id : "";
    }

    const getAvatar = () => {
        return logInfo ? JSON.parse(logInfo)[0].avatar : "";
    }

    const getDisplayName = () => {
        return logInfo ? JSON.parse(logInfo)[0].displayName : "";
    }

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setSidebarToggle(!sidebarToggle);
    }

    const getNavbarDashboard = () => {
        return (
            <nav className={"navbar navbar-expand-lg bg-body-tertiary " + astyles.navbartopadmdb}>
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">LCPBlog</Link>

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
                            <Link className="nav-link active" aria-current="page" href={"/pages/users/" + getUserId()}>
                                <Image src={'/images/' + getAvatar()} width={40} height={40} className={astyles.imgavatar + " me-3"} alt={getDisplayName() + "'s Avatar"} />
                                <span>{getDisplayName()}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    const getSidebarDashboard = () => {
        const links = [
            {
                name: "Home",
                link: "dashboard",
                icon: "bi-house",
                isActive: false
            },
            {
                name: "Posts",
                link: "dashboard/posts",
                icon: "bi-file-post",
                isActive: true
            },
            {
                name: "Users",
                link: "dashboard/users",
                icon: "bi-people",
                isActive: false
            }
        ];

        const mlinks: any = [];
        const prefix = "/pages/admin/";

        links.map((x, i) => (
            mlinks.push(
                <li className="nav-item" key={i}>
                    <Link className={"nav-link " + (x.isActive ? "active" : "")} aria-current={x.isActive ? "page" : "true"} href={prefix + x.link}>
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
            {getNavbarDashboard()}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                {getSidebarDashboard()}
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
                                                <div className="table-responsive">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                {tableHeaders.map((header, i) => (
                                                                    <th key={"thv"+i}>{header.title}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {posts.map((post: any, i: number) => {
                                                                const values = tableHeaders.map((thx) => post[thx.dataIndex]);

                                                                return (
                                                                    <tr key={"x"+i}>
                                                                        {values.map((v, k) => (
                                                                            <td key={"tdx"+k}>{v}</td>
                                                                        ))}
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan={tableHeaders.length ?? 1}>
                                                                    Total posts: {posts.length}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
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