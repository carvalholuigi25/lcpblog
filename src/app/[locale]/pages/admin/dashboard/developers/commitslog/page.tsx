/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/app/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { fcommitsSchema, TFormCommits } from "@applocale/schemas/formSchemas";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/loadingcomp";
import ShowAlert from "@applocale/components/alerts";
import axios from "axios";

const AdminCommitsLog = ({ locale }: { locale?: string }) => {
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarToggle, setSidebarToggle] = useState(true);
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
        resolver: zodResolver(fcommitsSchema),
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

        setIsAuthorized(logInfo && JSON.parse(logInfo)[0].role == "admin" ? true : false);
        setLoading(false);
    }, [logInfo, isAuthorized, isResetedForm]);

    if (loading) {
        return (
            <div className={astyles.admdashboard}>
                <LoadingComp type="icon" icontype="ring" />
            </div>
        );
    }

    const toggleSidebar = (e: any) => {
        e.preventDefault();
        setSidebarToggle(!sidebarToggle);
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
                setInfoCommits(err);
            });
        } catch (error: any) {
            console.error(error);
            setInfoCommits(error);
        }
    }

    const replaceUrl = (url: string) => {
        return url.replace("https://api.github.com/repos/"+formData.owner+"/"+formData.repository+"/git/commits/", "https://github.com/"+formData.owner+"/"+formData.repository+"/commit/");
    }

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
                                        <i className="bi bi-gear-fill me-2"></i>
                                        Developers
                                    </h3>
                                    <h4 className="text-center mt-3">
                                        <i className="bi bi-journal-richtext me-2"></i>
                                        Commits Log
                                    </h4>
                                </div>
                            </div>
                            <div className="row">
                            <div className="col-12">
                                    <form className={"frmcommits"}>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group mt-3 text-center hidden">
                                                    <label htmlFor="owner">Owner</label>
                                                    <div className={astyles.sformgroup}>
                                                        <input {...register("owner")} type="hidden" id="owner" name="owner" className={"form-control owner mt-3 " + astyles.sformgroupinp} placeholder="Write your owner name here..." value={formData.owner} onChange={handleChange} disabled required />
                                                    </div>

                                                    {errors.owner && ShowAlert("danger", errors.owner.message)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <div className="form-group mt-3 text-center hidden">
                                                    <label htmlFor="repository">Repository</label>
                                                    <div className={astyles.sformgroup}>
                                                        <input {...register("repository")} type="hidden" id="repository" name="repository" className={"form-control repository mt-3 " + astyles.sformgroupinp} placeholder="Write your repository name here..." value={formData.repository} onChange={handleChange} disabled required />
                                                    </div>

                                                    {errors.repository && ShowAlert("danger", errors.repository.message)}
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="form-group mt-3 text-center hidden">
                                                    <label htmlFor="branchname">Branch name</label>
                                                    <div className={astyles.sformgroup}>
                                                        <input {...register("branchname")} type="hidden" id="branchname" name="branchname" className={"form-control branchname mt-3 " + astyles.sformgroupinp} placeholder="Write your branch name here..." value={formData.branchname} onChange={handleChange} disabled required />
                                                    </div>

                                                    {errors.branchname && ShowAlert("danger", errors.branchname.message)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-inline-block mx-auto mt-3">
                                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                                            <button className="btn btn-primary btnlog btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Generate</button>
                                        </div>
                                    </form>

                                    {infoCommits && infoCommits.length > 0 && (
                                        <div className="myroundedscrollbar mt-3">
                                            <div className="table-responsive mtable-nobordered mtable-shadow mtable-long">
                                                <table className="table table-nobordered table-rounded table-shadow table-autolayout ws-pre">
                                                    <thead>
                                                        <tr>
                                                            <th>Id</th>
                                                            <th>Message</th>
                                                            <th>Author</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {infoCommits.map((x, i) => (
                                                            <tr key={i}>
                                                                <td>{""+(i+1)}</td>
                                                                <td><Link href={replaceUrl(x.url)}>{x.message}</Link></td>
                                                                <td>{x.author.name}</td>
                                                                <td>{x.committer.date}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
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

export default withAuth(AdminCommitsLog, ["admin"]);