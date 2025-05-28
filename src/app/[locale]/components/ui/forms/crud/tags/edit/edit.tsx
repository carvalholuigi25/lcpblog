/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useMySchemaTags, type TFormTags } from "@applocale/schemas/formSchemas";
import { Link } from '@/app/i18n/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Tags } from "@applocale/interfaces/tags";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import Toasts from "@/app/[locale]/components/ui/toasts/toasts";
import ShowAlert from "@/app/[locale]/components/ui/alerts";
import styles from "@applocale/page.module.scss";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@/app/[locale]/components/ui/loadingcomp";

const EditTagsForm = ({tagId, data}: {tagId: number, data: Tags}) => {
    const t = useTranslations("ui.forms.crud.tags.edit");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    
    const [formData, setFormData] = useState({
        tagId: data.tagId ?? 1,
        name: data.name ?? "#",
        status: data.status ?? "0"
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
    const [loading, setLoading] = useState(true);
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

        setValue("name", "#"+data.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));

        if(!!isResetedForm) {
            setFormData({
                tagId: data.tagId ?? 1,
                name: data.name ?? "#",
                status: data.status ?? "0"
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }
    }, [isResetedForm, logInfo, data, loading, setValue]);

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
    };

    const handleReset = (e: any) => {
        e.preventDefault();
        setIsResetedForm(true);
        setValue("name", "#");
    };

    const onSubmit = async () => {
        try {
            await FetchDataAxios({
                url: `api/tags/${tagId}`,
                method: 'put',
                data: {
                    tagId: tagId,
                    name: getValues("name")!,
                    updatedAt: new Date(),
                    status: formData.status
                },
            }).then(async (r) => {
                console.log(r);
                setDataToast({type: "success", message: t("messages.success") ?? "Tag has been edited sucessfully!", statusToast: true});

                setTimeout(async () => {
                    push("/"+locale);
                }, 1000 / 2);
            }).catch((err) => {
                setDataToast({type: "error", message: t("messages.error", {message: ""+err.message}) ?? `Error when editing tag! Message: ${err.message}`, statusToast: true});

                setTimeout(() => {
                    location.reload();
                }, 1000 * 1);
            });
        } catch (error) {
            setDataToast({type: "error", message: t("messages.errorapi", {message: ""+error}) ?? `Occurred an error when trying to edit the tag! Message: ${error}`, statusToast: true});
            
            setTimeout(() => {
                location.reload();
            }, 1000 * 1);
        }
    };

    return (
        <div className="container">
            {dataToast.statusToast && <Toasts id={"toastEditTagsForm"} data={dataToast} />}

            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{marginTop: '3rem'}}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{fontSize: '4rem'}} />
                                <p className="mt-3">
                                    {t('messages.unauth') ?? "You are not authorized to see this page!"}
                                </p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>
                                    {tbtn('btnback') ?? "Back"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">{t('title') ?? 'Edit tag'}</h3>
                    <form className={styles.frmedittags} onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mt-3 text-center">
                            <label htmlFor="name">{t('lblname') ?? "Name"}</label>
                            <div className={styles.sformgroup}>
                                <input {...register("name")} type="text" id="name" name="name" className={"form-control name mt-3 " + styles.sformgroupinp} placeholder={t("inpname") ?? "Write your name of tag here..."} value={formData.name} onChange={handleChange} required />
                            </div>

                            {errors.name && ShowAlert("danger", errors.name.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="status">{t('lblstatus') ?? "Status"}</label>
                            <div className={styles.sformgroup}>
                                <select {...register("status")} id="status" name="status" className={"form-control status mt-3 " + styles.sformgroupinp} value={formData.status} onChange={handleChange}>
                                    <option disabled>{t('inpstatus.options.sel') ?? "Select the option of status"}</option>
                                    <option value={"0"}>{t('inpstatus.options.all') ?? "All"}</option>
                                    <option value={"1"}>{t('inpstatus.options.locked') ?? "Locked"}</option>
                                    <option value={"2"}>{t('inpstatus.options.deleted') ?? "Deleted"}</option>
                                </select>
                            </div>

                            {errors.status && ShowAlert("danger", errors.status.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>
                                {t('btnreset') ?? "Reset"}
                            </button>
                            <button type="submit" className="btn btn-primary btnedit btn-rounded ms-3" disabled={isSubmitting}>
                                {t('btnedit') ?? "Edit"}
                            </button>
                        </div>
                    </form>
                    
                    <div className="col-12">
                        <div className="mt-3 mx-auto text-center">
                            <Link href={'/'} className="btn btn-primary btn-rounded" locale={getDefLocale()}>
                                {tbtn('btnback') ?? "Back"}
                            </Link>
                        </div>
                    </div>
                </>
            )}  
        </div>
    );
}

export default EditTagsForm;