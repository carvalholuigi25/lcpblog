/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { FetchMultipleData } from "@applocale/utils/fetchdata";
import { Categories } from "@applocale/interfaces/categories";
import { Posts } from "@applocale/interfaces/posts";
import { Tags } from "@applocale/interfaces/tags";
import { User } from "@applocale/interfaces/user";
import { useTheme } from "@applocale/components/context/themecontext";
import { GetChartTypes } from "@applocale/functions/chartfunctions";
import { Schedules } from "@applocale/interfaces/schedules";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import ChartData from "@applocale/components/admin/dashboard/chartdata";
import TableData from "@applocale/components/admin/dashboard/tabledata";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import MyPagination from "@applocale/components/mypagination";
import LoadingComp from "@applocale/components/loadingcomp";
import Schedule from "@applocale/components/schedule";

const AdminHomeDashboard = ({ locale }: { locale?: string }) => {
    const t = useTranslations('pages.AdminPages.Dashboard');
    const ttbl = useTranslations("ui.tables.tabledata");
    const tbtn = useTranslations('ui.buttons');
    const chartTypesAry = GetChartTypes();
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarToggle, setSidebarToggle] = useState(true);
    const [posts, setPosts] = useState(new Array<Posts>());
    const [categories, setCategories] = useState(new Array<Categories>());
    const [tags, setTags] = useState(new Array<Tags>());
    const [users, setUsers] = useState(new Array<User>());
    const [schedules, setSchedules] = useState(new Array<Schedules>());
    const [chartTypeSelVal, setChartTypeSelVal] = useState('verticalbar');
    const [postsLength, setPostsLength] = useState(0);
    const [categoriesLength, setCategoriesLength] = useState(0);
    const [tagsLength, setTagsLength] = useState(0);
    const [usersLength, setUsersLength] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const { theme } = useTheme();

    const searchParams = useSearchParams();
    const spage = searchParams.get("page");
    
    const isContainerFluid = true;
    const enableChangeChartType = true;
    const pageSize: number = 10;
    
    const tableHeaders = [
        { dataIndex: 'postId', title: ttbl('header.id') ?? 'Post Id' },
        { dataIndex: 'title', title: ttbl('header.title') ?? 'Title' },
        { dataIndex: 'createdAt', title: ttbl('header.createdAt') ?? 'Created At' },
        { dataIndex: 'updatedAt', title: ttbl('header.updatedAt') ?? 'Updated At' },
        { dataIndex: 'slug', title: ttbl('header.slug') ?? 'Slug' },
        { dataIndex: 'userId', title: ttbl('header.userId') ?? 'User Id' }
    ];

    useEffect(() => {
        async function fetchPosts() {
            const curindex = page;
            const params = `?page=${curindex}&pageSize=${pageSize}`;

            const data = await FetchMultipleData([{
                url: 'api/posts'+params,
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
                setPostsLength(data[0].totalCount);
            }

            if (data[1].data) {
                setCategories(JSON.parse(JSON.stringify(data[1].data)));
                setCategoriesLength(data[1].totalCount);
            }

            if (data[2].data) {
                setTags(JSON.parse(JSON.stringify(data[2].data)));
                setTagsLength(data[2].totalCount);
            }

            if (data[3].data) {
                setUsers(JSON.parse(JSON.stringify(data[3].data)));
                setUsersLength(data[3].totalCount);
            }

            setTotalPages(data[0].totalPages);
            setPage(spage ? parseInt(spage! ?? 1, 0) : 1);
        }

        async function fetchSchedules() {
            const data = await FetchMultipleData([{
                url: 'api/schedules',
                method: 'get',
                reqAuthorize: false
            }]);

            if(data[0].data) {
                setSchedules(JSON.parse(JSON.stringify(data[0].data)));
            }
        }

        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setChartTypeSelVal(getFromStorage("mychart")!);
        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        fetchPosts();
        fetchSchedules();
        setLoading(false);
    }, [logInfo, isAuthorized, page, spage, chartTypeSelVal]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
                <LoadingComp type="icon" icontype="ring" />
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

    const onChangeChartType = (e: any) => {
        setChartTypeSelVal(e.target.value);
        saveToStorage("mychart", e.target.value);
    };

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
                                        {t('lblhome') ?? "Home"}
                                    </h3>
                                    <p className="text-center mt-3">{t('lblwelcome', {displayName: getDisplayName()}) ?? `Welcome ${getDisplayName()}`}</p>
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
                                                    {(postsLength ?? posts.length) + " " + (postsLength != 1 ? (t('stats.lbltotalpostspl') ?? ' Posts') : (t('stats.lbltotalposts') ?? ' Post'))}
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
                                                    {(categoriesLength ?? categories.length) + " " + (categoriesLength != 1 ? (t('stats.lbltotalcategoriespl') ?? ' Categories') : (t('stats.lbltotalcategories') ?? ' Category'))}
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
                                                    {(tagsLength ?? tags.length) + " " + (tagsLength != 1 ? (t('stats.lbltotaltagspl') ?? ' Tags') : (t('stats.lbltotaltags') ?? ' Tag'))}
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
                                                    {(usersLength ?? users.length) + " " + (usersLength != 1 ? (t('stats.lbltotaluserspl') ?? ' Users') : (t('stats.lbltotalusers') ?? ' User'))}
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
                                    {enableChangeChartType && (
                                        <div className="d-flex justify-content-center w-100">
                                            <select className="form-control mb-3 w-auto bshadow" value={chartTypeSelVal ?? 'verticalbar'} onChange={onChangeChartType}>
                                                <option value={""} disabled>{t('charttypes.seloption') ?? "Select the chart type"}</option>
                                                {chartTypesAry.length > 0 && chartTypesAry.map(x => (
                                                    <option key={x.id} value={x.value}>{x.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <ChartData theme={theme} type={chartTypeSelVal} />
                                </div>
                                <div className="col-12 col-md-6 col-lg-6 mt-3">
                                    <TableData tdata={posts} theaders={tableHeaders} namep={ttbl('titletable') ?? "news"} locale={locale ?? getDefLocale()} currentPage={page} totalPages={totalPages} linkSuffix="news" />
                                    <MyPagination cid={-1} pid={-1} currentPage={page} totalPages={totalPages} />
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 p-3"}>
                            <div className="row">
                                <div className="col-12">
                                    <Schedule data={schedules} />
                                </div>
                            </div>
                        </div>

                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " mt-3 p-3"}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mx-auto text-center">
                                        <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>
                                            {tbtn('btnback') ?? "Back"}
                                        </Link>
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

export default withAuth(AdminHomeDashboard, ["admin"]);