/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/app/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useMySchemaCommits, type TFormCommits } from "@applocale/schemas/formSchemas";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import ShowAlert from "@applocale/components/ui/alerts";
import axios from "axios";
import { useTranslations } from "next-intl";

const AdminCommitsLog = ({ locale }: { locale?: string }) => {
    const t = useTranslations("pages.AdminPages.DevelopersPage");

    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [barToggle, setBarToggle] = useState(true);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [infoCommits, setInfoCommits] = useState(new Array<any>());

    const [formData, setFormData] = useState({
        owner: "carvalholuigi25",
        repository: "lcpblog",
        branchname: "main"
    });

    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<TFormCommits>({
        resolver: zodResolver(useMySchemaCommits()),
    });

    const isContainerFluid = true;

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        if (!!isResetedForm) {
            setFormData({
                owner: "carvalholuigi25",
                repository: "lcpblog",
                branchname: "main"
            });
        }

        setIsAuthorized(logInfo && ["admin", "dev"].includes(JSON.parse(logInfo)[0].role) ? true : false);
        setLoading(false);
    }, [logInfo, isAuthorized, isResetedForm]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
                <LoadingComp type="icon" icontype="ring" />
            </div>
        );
    }

    const closeSidebar = () => {
        setBarToggle(true);
    }

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setBarToggle(!barToggle);
    }

    const handleReset = () => {
        setIsResetedForm(true);
        setInfoCommits(new Array<any>());
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await axios({
                url: `https://api.github.com/repos/${formData.owner}/${formData.repository}/commits`,
                method: 'get',
                headers: {
                    "Authorization": `Bearer ${process.env.ghToken}`,
                }
            }).then((r: any) => {
                setInfoCommits(r.data.map((x: any) => x.commit));
            }).catch((err: any) => {
                console.error(err);
                setInfoCommits([{ error: err }]);
            });
        } catch (error: any) {
            console.error(error);
            setInfoCommits([{ error: error }]);
        }
    }

    const replaceUrl = (url: string) => {
        return url.replace("https://api.github.com/repos/" + formData.owner + "/" + formData.repository + "/git/commits/", "https://github.com/" + formData.owner + "/" + formData.repository + "/commit/");
    }

    return (
        <div className={"mpage " + astyles.admdashboard} id="admdashboard">
            {!!isAuthorized && (
                <AdminNavbarDashboard locale={locale ?? getDefLocale()} logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} />
            )}

            <div className="container-fluid mt-3">
                {!!isAuthorized && (
                    <>
                        <div className={"container" + (!!isContainerFluid ? "-fluid" : "") + " p-3"}>
                            <div className="row">
                                <div className={"col-12 col-md-12 col-lg-12"}>
                                    <AdminSidebarDashboard locale={locale ?? getDefLocale()} sidebarStatus={barToggle} toggleSidebar={toggleSidebar} onClose={closeSidebar} />
                                </div>
                                <div className={"col-12 col-md-12 col-lg-12"}>
                                    <h3 className="text-center titlep">
                                        <i className="bi bi-gear-fill me-2"></i>
                                        {t("title") ?? "Developers"}
                                    </h3>
                                    <h4 className="text-center mt-3 stitlep">
                                        <i className="bi bi-journal-richtext me-2"></i>
                                        {t("CommitsLogPage.title") ?? "Commits Log"}
                                    </h4>

                                    <div className="mt-3">
                                        <form className={"frmcommits"}>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-group mt-3 text-center hidden">
                                                        <label htmlFor="owner">{t("CommitsLogPage.form.lblowner") ?? "Owner"}</label>
                                                        <div className={astyles.sformgroup}>
                                                            <input {...register("owner")} type="hidden" id="owner" name="owner" className={"form-control owner mt-3 " + astyles.sformgroupinp} placeholder={t("CommitsLogPage.form.inpowner") ?? "Write here the name of owner"} value={formData.owner} onChange={handleChange} disabled required />
                                                        </div>

                                                        {errors.owner && ShowAlert("danger", errors.owner.message)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    <div className="form-group mt-3 text-center hidden">
                                                        <label htmlFor="repository">{t("CommitsLogPage.form.lblrepository") ?? "Repository"}</label>
                                                        <div className={astyles.sformgroup}>
                                                            <input {...register("repository")} type="hidden" id="repository" name="repository" className={"form-control repository mt-3 " + astyles.sformgroupinp} placeholder={t("CommitsLogPage.form.inprepository") ?? "Write here the name of repository"} value={formData.repository} onChange={handleChange} disabled required />
                                                        </div>

                                                        {errors.repository && ShowAlert("danger", errors.repository.message)}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="form-group mt-3 text-center hidden">
                                                        <label htmlFor="branchname">{t("CommitsLogPage.form.lblbranchname") ?? "Branch name"}</label>
                                                        <div className={astyles.sformgroup}>
                                                            <input {...register("branchname")} type="hidden" id="branchname" name="branchname" className={"form-control branchname mt-3 " + astyles.sformgroupinp} placeholder={t("CommitsLogPage.form.inpbranchname") ?? "Write here the branch name here..."} value={formData.branchname} onChange={handleChange} disabled required />
                                                        </div>

                                                        {errors.branchname && ShowAlert("danger", errors.branchname.message)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-inline-block mx-auto mt-3">
                                                <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>
                                                    {t("CommitsLogPage.form.btnreset") ?? "Reset"}
                                                </button>
                                                <button className="btn btn-primary btnlog btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                                    {t("CommitsLogPage.form.btngenerate") ?? "Generate"}
                                                </button>
                                                <Link className="btn btn-primary btnmorecommits btn-rounded ms-3" href={`https://github.com/${formData.owner}/${formData.repository}/commits`} target="_blank">
                                                    {t("CommitsLogPage.form.btnmorecommits") ?? "More commits?"}
                                                </Link>
                                            </div>
                                        </form>

                                        {infoCommits && infoCommits.length > 0 && (
                                            <>
                                                <ul className="nav nav-pills mynavdatamode mb-3" id="pills-tab" role="tablist">
                                                    <li className="nav-item" role="presentation">
                                                        <button className="nav-link active" id="pills-table-tab" data-bs-toggle="pill" data-bs-target="#pills-table" type="button" role="tab" aria-controls="pills-table" aria-selected="true">
                                                            <i className="bi bi-table"></i>
                                                            <span className="ms-2">
                                                                {t("CommitsLogPage.buttons.btntable") ?? "Table"}
                                                            </span>
                                                        </button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button className="nav-link" id="pills-json-tab" data-bs-toggle="pill" data-bs-target="#pills-json" type="button" role="tab" aria-controls="pills-json" aria-selected="false">
                                                            <i className="bi bi-filetype-json"></i>
                                                            <span className="ms-2">
                                                                {t("CommitsLogPage.buttons.btnjson") ?? "JSON"}
                                                            </span>
                                                        </button>
                                                    </li>
                                                </ul>

                                                <div className="tab-content" id="pills-tabContent">
                                                    <div className="tab-pane fade show active" id="pills-table" role="tabpanel" aria-labelledby="pills-table-tab" tabIndex={0}>
                                                        <div className="myroundedscrollbar mt-3">
                                                            <div className="table-responsive mtable-nobordered mtable-shadow mtable-long">
                                                                <table className="table table-nobordered table-rounded table-shadow table-autolayout ws-pre">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>{t("CommitsLogPage.table.header.id") ?? "Id"}</th>
                                                                            <th>{t("CommitsLogPage.table.header.message") ?? "Message"}</th>
                                                                            <th>{t("CommitsLogPage.table.header.author") ?? "Author"}</th>
                                                                            <th>{t("CommitsLogPage.table.header.date") ?? "Date"}</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {infoCommits.map((x, i) => (
                                                                            <tr key={i}>
                                                                                <td>{"" + (i + 1)}</td>
                                                                                <td><Link href={replaceUrl(x.url)}>{x.message}</Link></td>
                                                                                <td>{x.author.name}</td>
                                                                                <td>{x.committer.date}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="tab-pane fade" id="pills-json" role="tabpanel" aria-labelledby="pills-json-tab" tabIndex={0}>
                                                        <div className="myroundedscrollbar">
                                                            <pre className="contentjson">
                                                                <code>{JSON.stringify(infoCommits, null, 4)}</code>
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
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

export default withAuth(AdminCommitsLog, ["admin", "dev"]);