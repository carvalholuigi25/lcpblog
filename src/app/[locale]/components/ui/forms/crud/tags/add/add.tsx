/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useMySchemaTags, type TFormTags } from "@applocale/schemas/formSchemas";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import ShowAlert from "@applocale/components/ui/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";

const AddTagsForm = () => {
    const t = useTranslations("ui.forms.crud.tags.add");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();

    const [formData, setFormData] = useState({
        name: "#",
        status: "0"
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);

    const { push } = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        getValues
    } = useForm<TFormTags>({
        resolver: zodResolver(useMySchemaTags()),
    });

    watch();

    useEffect(() => {
        setValue("name", "#");

        if (!!isResetedForm) {
            setFormData({
                name: "#",
                status: "0"
            });
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }
    }, [isResetedForm, logInfo, loading, t, setValue]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const nvalue = value.replace(/\s+/g, "-");
        setFormData({ ...formData, [name]: nvalue });

        if(name === "name") {
            if(value.length == 0) {
                setFormData({...formData, ["name"]: "#"});
            }

            setValue("name", "#"+nvalue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
        }
    }

    const handleReset = (e: any) => {
        e.preventDefault();
        setIsResetedForm(true);
        setValue("name", "#");
    }

    const onSubmit = async () => {
        try {
            await FetchDataAxios({
                url: `api/tags`,
                method: 'post',
                data: {
                    name: getValues("name")!,
                    createdAt: new Date(),
                    status: formData.status
                },
                reqAuthorize: false
            }).then(async (r) => {
                console.log(r);
                setDataToast({ type: "success", message: t("messages.addsuccess") ?? "The tag has been added sucessfully!", statusToast: true });

                setTimeout(async () => {
                    setIsResetedForm(true);
                    push("/" + locale);
                }, 1000 * 1);
            }).catch((err) => {
                setDataToast({ type: "error", message: t("messages.adderror", { message: "" + err }) ?? `Failed to add tag! Message: ${err}`, statusToast: true });
                setIsResetedForm(true);
                
                setTimeout(() => {
                    location.reload();
                }, 1000 * 1);
            });
        } catch (error) {
            setDataToast({ type: "error", message: t("messages.adderrorapi", { message: "" + error }) ?? `Error when adding tag! Message: ${error}`, statusToast: true });
            setIsResetedForm(true);
            
            setTimeout(() => {
                location.reload();
            }, 1000 * 1);
        }
    }

    return (
        <div className="container">
            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{ marginTop: '3rem' }}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{ fontSize: '4rem' }} />
                                <p className="mt-3">
                                    {t("messages.unauth") ?? "You are not authorized to see this page!"}
                                </p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>
                                    {tbtn("btnback") ?? "Back"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    {dataToast.statusToast && <Toasts id={"toastAddTags"} data={dataToast} modeType={1} />}

                    <h3 className="title mx-auto text-center">
                        {t('title') ?? 'Add tags'}
                    </h3>

                    <form className={styles.frmaddtags} onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mt-3 text-center">
                            <label htmlFor="name">
                                {t('lblname') ?? "Name"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("name")} type="text" id="name" name="name" className={"form-control name mt-3 " + styles.sformgroupinp} placeholder={t("inpname") ?? "Write the name here..."} value={formData.name} onChange={handleChange} required />
                            </div>

                            {errors.name && ShowAlert("danger", errors.name.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="status">
                                {t('lblstatus') ?? "Status:"}
                            </label>
                            <div className={styles.sformgroup}>
                                <select {...register("status")} id="status" name="status" className={"form-control status mt-3 " + styles.sformgroupinp} value={formData.status} onChange={handleChange}>
                                    <option disabled>
                                        {t('liststatus.options.sel') ?? "Select the option of status"}
                                    </option>
                                    <option value={"0"}>
                                        {t('liststatus.options.all') ?? "All"}
                                    </option>
                                    <option value={"1"}>
                                        {t('liststatus.options.locked') ?? "Locked"}
                                    </option>
                                    <option value={"2"}>
                                        {t('liststatus.options.deleted') ?? "Deleted"}
                                    </option>
                                </select>
                            </div>

                            {errors.status && ShowAlert("danger", errors.status.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="button" onClick={handleReset}>
                                {t("btnreset") ?? "Reset"}
                            </button>
                            <button type="submit" className="btn btn-primary btnadd btn-rounded ms-3" disabled={isSubmitting}>
                                {t("btnadd") ?? "Add"}
                            </button>
                        </div>
                    </form>

                    <div className="col-12">
                        <div className="mt-3 mx-auto text-center">
                            <Link href={'/'} className="btn btn-primary btn-rounded" locale={getDefLocale()}>
                                {tbtn("btnback") ?? "Back"}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AddTagsForm;