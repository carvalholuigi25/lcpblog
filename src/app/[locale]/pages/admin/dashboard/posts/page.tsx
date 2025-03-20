/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { Posts } from "@applocale/interfaces/posts";
import astyles from "@applocale/styles/adminstyles.module.scss";
import FetchData from "@applocale/utils/fetchdata";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import {Link} from '@/app/i18n/navigation';
import Footer from "@applocale/ui/footer";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";
import withAuth from "@/app/[locale]/utils/withAuth";

const AdminPosts = ({locale}: {locale?: string}) => {
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
        { dataIndex: 'createdAt', title: 'Created At' },
        { dataIndex: 'updatedAt', title: 'Updated At' },
        { dataIndex: 'slug', title: 'Slug' },
        { dataIndex: 'userId', title: 'User Id' },
    ];

    return (
        <div className={astyles.admdashboard}>
            {!!isAuthorized && (
                <AdminNavbarDashboard logInfo={logInfo} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} locale={locale ?? getDefLocale()} />
            )}

            <div className="container-fluid">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                <AdminSidebarDashboard sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} locale={locale ?? getDefLocale()} />
                            </div>
                            <div className={"col-12 col-md-" + (!sidebarToggle ? "9" : "12") + " col-lg-" + (!sidebarToggle ? "10" : "12") + ""}>
                                <h3 className="text-center">
                                    <i className="bi bi-file-post me-2"></i>
                                    Posts
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="btn-group" role="group" aria-label="News data actions">
                                                <Link href={'/pages/news/add'} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btncreatenews">Add news</Link>
                                            </div>
                                        </div>

                                        {!!posts && (
                                            <div className="col-12 mt-3">
                                                <TableData theaders={tableHeaders} tdata={posts} namep="news" locale={locale ?? getDefLocale()} />
                                            </div>
                                        )}

                                        {!posts && (
                                            <div className='col-12 card p-3 mt-3 text-center'>
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
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>Back</Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default withAuth(AdminPosts, ["admin"]);