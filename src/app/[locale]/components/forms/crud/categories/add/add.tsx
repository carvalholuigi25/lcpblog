/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { TFormCategories, fcategoriesSchema } from "@applocale/schemas/formSchemas";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import { useRouter } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import ShowAlert from "@applocale/components/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";
import * as signalR from "@microsoft/signalr";

const AddCategoriesForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        status: "0"
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        getValues
    } = useForm<TFormCategories>({
        resolver: zodResolver(fcategoriesSchema),
    });

    watch();

    useEffect(() => {
        async function addMyRealData() {
            const connect = await buildMyConnection("datahub", false);
            setConnection(connect);
        
            try {
                await connect.stop();
                await connect.start();
                console.log("Connection started");
            } catch (e) {
                console.log(e);
            }
        
            connect.on("ReceiveMessage", () => {
                console.log("message added");
            });
        
            return () => connect.stop();
        }

        setValue("slug", "/");

        if(!!isResetedForm) {
            setFormData({
                name: "",
                slug: "/",
                status: "0"
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if(!loading) {
            addMyRealData();
        }
    }, [isResetedForm, logInfo, loading, setValue]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if(name === "name") {
            setValue("slug", "/"+value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
        }
    };

    const handleReset = () => {
        setIsResetedForm(true);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/categories`,
                method: 'post',
                data: {
                    name: formData.name,
                    slug: getValues("slug")!,
                    status: formData.status
                },
                reqAuthorize: false
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The new category has been added sucessfully!");
                    await sendMessage(connection!, r.data);
                    push("/");
                }, 1000 / 2);
            }).catch((err) => {
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{marginTop: '3rem'}}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{fontSize: '4rem'}} />
                                <p className="mt-3">You are not authorized to see this page!</p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Add categories</h3>
                    <form className={styles.frmaddcategories}>
                        <div className="form-group mt-3 text-center">
                            <label htmlFor="name">Name</label>
                            <div className={styles.sformgroup}>
                                <input {...register("name")} type="text" id="name" name="name" className={"form-control name mt-3 " + styles.sformgroupinp} placeholder="Write your name of category here..." value={formData.name} onChange={handleChange} required />
                            </div>

                            {errors.name && ShowAlert("danger", errors.name.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="slug">Slug Url:</label>
                            <div className={styles.sformgroup}>
                                <input {...register("slug")} type="text" id="slug" name="slug" className={"form-control slug mt-3 " + styles.sformgroupinp} placeholder="Write your slug url here..." onChange={handleChange} disabled />
                            </div>

                            {errors.slug && ShowAlert("danger", errors.slug.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="status">Status:</label>
                            <div className={styles.sformgroup}>
                                <select {...register("status")} id="status" name="status" className={"form-control status mt-3 " + styles.sformgroupinp} value={formData.status} onChange={handleChange}>
                                    <option disabled>Select the option of status</option>
                                    <option value={"0"}>All</option>
                                    <option value={"1"}>Locked</option>
                                    <option value={"2"}>Deleted</option>
                                </select>
                            </div>

                            {errors.status && ShowAlert("danger", errors.status.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                            <button className="btn btn-primary btnadd btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Add</button>
                        </div>
                    </form>
                    
                    <div className="col-12">
                        <div className="mt-3 mx-auto text-center">
                            <Link href={'/'} className="btn btn-primary btn-rounded" locale={getDefLocale()}>Back</Link>
                        </div>
                    </div>
                </>
            )}  
        </div>
    );
}

export default AddCategoriesForm;