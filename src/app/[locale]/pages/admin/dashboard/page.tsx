/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import astyles from "@applocale/styles/adminstyles.module.scss";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import ChartData from "@applocale/components/admin/dashboard/chartdata";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { FetchMultipleData } from "@applocale/utils/fetchdata";
import { Categories } from "@applocale/interfaces/categories";
import { Posts } from "@applocale/interfaces/posts";
import { Tags } from "@applocale/interfaces/tags";
import { User } from "@applocale/interfaces/user";

const AdminDashboard = ({ locale }: { locale?: string }) => {
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarToggle, setSidebarToggle] = useState(true);
    const [posts, setPosts] = useState(new Array<Posts>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [tags, setTags] = useState(new Array<Tags>());
    const [users, setUsers] = useState(new Array<User>());

    useEffect(() => {
        async function fetchPosts() {
            const data = await FetchMultipleData([{
                url: 'api/posts',
                method: 'get',
                reqAuthorize: false
            },
            {
                url: 'api/categories',
                method: 'get',
                reqAuthorize: false
            },
            {
                url: 'api/tags',
                method: 'get',
                reqAuthorize: false
            },
            {
                url: 'api/users',
                method: 'get',
                reqAuthorize: true
            }]);

            if (data[0].data) {
                setPosts(JSON.parse(JSON.stringify(data[0].data)));
            }

            if (data[1].data) {
                setCategories(JSON.parse(JSON.stringify(data[1].data)));
            }

            if (data[2].data) {
                setTags(JSON.parse(JSON.stringify(data[2].data)));
            }

            if (data[3].data) {
                setUsers(JSON.parse(JSON.stringify(data[3].data)));
            }
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        fetchPosts();
        setLoading(false);
    }, [logInfo, isAuthorized]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
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

    const getDisplayName = () => {
        return logInfo ? JSON.parse(logInfo)[0].displayName : "";
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

    const isContainerFluid = true;

    return (
        <div className={astyles.admdashboard}>
            {!!isAuthorized && (
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
            )}

            <div className="container-fluid mt-3">
                {!!isAuthorized && (
                    <>
                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " p-3"}>
                            <div className="row">
                                <div className={"col-12 col-md-" + (!sidebarToggle ? "3" : "12") + " col-lg-" + (!sidebarToggle ? "2" : "12")}>
                                    <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarToggle={sidebarToggle} toggleSidebar={toggleSidebar} />
                                </div>
                                <div className={"col-12 col-md-" + (!sidebarToggle ? "9" : "12") + " col-lg-" + (!sidebarToggle ? "10" : "12") + ""}>
                                    <h3 className="text-center">
                                        <i className="bi bi-house me-2"></i>
                                        Home
                                    </h3>
                                    <p className="text-center mt-3">Welcome {getDisplayName()}</p>
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 mx-auto text-center p-3"}>
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-4 col-lg-4 col-xl-3 mt-3">
                                    <div className="card p-3 bshadow">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="card-text">
                                                    {posts.length + ' Post' + (posts.length != 1 ? 's' : '')}
                                                </span>
                                                <i className="bi bi-file-earmark-post" style={{ fontSize: "1.4rem" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4 col-lg-4 col-xl-3 mt-3">
                                    <div className="card p-3 bshadow">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="card-text">
                                                    {categories.length + ' Categor' + (categories.length != 1 ? 'ies' : 'y')}
                                                </span>
                                                <i className="bi bi-bookmark" style={{ fontSize: "1.4rem" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4 col-lg-4 col-xl-3 mt-3">
                                    <div className="card p-3 bshadow">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="card-text">
                                                    {tags.length + ' Tag' + (tags.length != 1 ? 's' : '')}
                                                </span>
                                                <i className="bi bi-tag" style={{ fontSize: "1.4rem" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4 col-lg-4 col-xl-3 mt-3">
                                    <div className="card p-3 bshadow">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="card-text">
                                                    {users.length + ' User' + (users.length != 1 ? 's' : '')}
                                                </span>
                                                <i className="bi bi-people" style={{ fontSize: "1.4rem" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 p-3"}>
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-6 mt-3">
                                    <ChartData />
                                </div>
                                <div className="col-12 col-md-6 col-lg-6 mt-3">
                                    <TableData tdata={posts} theaders={tableHeaders} namep="News" locale={locale ?? getDefLocale()} />
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 p-3"}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mx-auto text-center">
                                        <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>Back</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default withAuth(AdminDashboard, ["admin"]);