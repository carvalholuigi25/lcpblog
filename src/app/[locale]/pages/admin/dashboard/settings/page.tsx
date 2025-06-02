/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import astyles from "@applocale/styles/adminstyles.module.scss";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFormAdmSettings, useMySchemaAdmSettings } from "@applocale/schemas/formSchemas";
import AdminSidebarDashboard from "@applocale/components/admin/dashboard/adbsidebar";
import AdminNavbarDashboard from "@applocale/components/admin/dashboard/adbnavbar";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import ShowAlert from "@applocale/components/ui/alerts";
import * as config from "@applocale/utils/config";
import { DataToastsProps } from "@/app/[locale]/interfaces/toasts";
import Toasts from "@/app/[locale]/components/ui/toasts/toasts";

const AdminSettings = () => {
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.SettingsPage");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [barToggle, setBarToggle] = useState(true);
    const [isSettingsEnabled, setIsSettingsEnabled] = useState(true);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [formData, setFormData] = useState({
        theme: config.getConfigSync().theme ?? "glassmorphism",
        is3DEffectsEnabled: config.getConfigSync().is3DEffectsEnabled ?? false,
        isBordered: config.getConfigSync().isBordered ?? true,
        language: config.getConfigSync().language ?? "pt-PT"
    });
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps); 

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TFormAdmSettings>({
        resolver: zodResolver(useMySchemaAdmSettings()),
    });

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        if (!!isResetedForm) {
            setFormData({
                theme: "glassmorphism",
                is3DEffectsEnabled: false,
                isBordered: true,
                language: "pt-PT"
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

    const toggleSettings = (e: any) => {
        setIsSettingsEnabled(e.target.checked);
    }

    const toggle3DEffects = (e: any) => {
        setFormData({ ...formData, ["is3DEffectsEnabled"]: e.target.checked });
    }

    const toggleBorderedEffect = (e: any) => {
        setFormData({ ...formData, ["isBordered"]: e.target.checked });
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
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onSubmit = async () => {
        console.log(formData);
        await axios({
            url: `/api/config`,
            method: 'PUT',
            headers: { 
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json; charset=utf-8' 
            },
            data: JSON.stringify(formData)
        }).then((r) => {
            console.log(r);
            setDataToast({type: "success", message: t("form.apimessages.success") ?? "Updated the new settings!", statusToast: true});
        }).catch((e) => {
            console.log(e);
            setDataToast({type: "error", message: t("form.apimessages.error", {message: ""+e.message}) ?? `Failed to update the settings! Message: ${e.message}`, statusToast: true});
        });
    }

    return (
        <div className={"admpage " + astyles.admdashboard} id="admdashboard">
            {dataToast.statusToast && <Toasts id={"toastUpdateSettings"} data={dataToast} />}
            
            {!!isAuthorized && (
                <AdminNavbarDashboard logInfo={logInfo} navbarStatus={barToggle} toggleNavbar={toggleSidebar} locale={locale ?? getDefLocale()} />
            )}

            <div className="container">
                <div className="row p-3">
                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <AdminSidebarDashboard sidebarStatus={barToggle} toggleSidebar={toggleSidebar} locale={locale ?? getDefLocale()} onClose={closeSidebar} />
                            </div>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <h3 className="text-center titlep">
                                    <i className="bi bi-gear-fill me-2"></i>
                                    {t("title") ?? "Settings"}
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <form className="frmensettings">
                                                <div className={"form-group mt-3 text-center"}>
                                                    <label htmlFor="ensettings">{t('form.lblensettings') ?? "Is Settings Enabled?"}</label>
                                                    <input type="checkbox" id="inpensettings" name="inpensettings" className={"form-control inpensettings mt-3 sformgroupinp"} placeholder={t('form.inpensettings') ?? "Toggle the settings"} checked={isSettingsEnabled} width={50} height={50} onChange={toggleSettings} />
                                                </div>
                                            </form>

                                            <form className={"frmsettings " + (!isSettingsEnabled ? "hidden" : "")} onSubmit={handleSubmit(onSubmit)}>
                                                <div className={"form-group mt-3 text-center"}>
                                                    <label htmlFor="theme">{t('form.lbltheme') ?? "Theme"}</label>
                                                    <input {...register("theme")} type="text" id="theme" name="theme" className={"form-control theme mt-3 sformgroupinp"} placeholder={t('form.inptheme') ?? "Write the theme name here... (e.g: glassmorphism)"} value={formData.theme} onChange={handleChange} required />

                                                    {errors.theme && ShowAlert("danger", errors.theme.message)}
                                                </div>

                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className={"form-group mt-3 text-center"}>
                                                            <label htmlFor="3deffects">{t('form.lbl3deffects') ?? "Is 3D Effects Enabled?"}</label>
                                                            <input {...register("is3DEffectsEnabled")} type="checkbox" id="inp3deffects" name="inp3deffects" className={"form-control inp3deffects mt-3 sformgroupinp"} placeholder={t('form.inp3deffects') ?? "Check the 3D effects"} checked={formData.is3DEffectsEnabled} width={50} height={50} onChange={toggle3DEffects} />

                                                            {errors.is3DEffectsEnabled && ShowAlert("danger", errors.is3DEffectsEnabled.message)}
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className={"form-group mt-3 text-center"}>
                                                            <label htmlFor="isBordered">{t('form.lblbordered') ?? "Is Bordered Enabled?"}</label>
                                                            <input {...register("isBordered")} type="checkbox" id="inpbordered" name="inpbordered" className={"form-control inpbordered mt-3 sformgroupinp"} placeholder={t('form.inpbordered') ?? "Check the bordered effect"} checked={formData.isBordered} width={50} height={50} onChange={toggleBorderedEffect} />

                                                            {errors.isBordered && ShowAlert("danger", errors.isBordered.message)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="clearfix"></div>

                                                <div className={"form-group mt-3 text-center"}>
                                                    <label htmlFor="language">{t('form.lbllanguage') ?? "Language"}</label>
                                                    <input {...register("language")} type="text" id="language" name="language" className={"form-control language mt-3 sformgroupinp"} placeholder={t('form.inplanguage') ?? "Write the language name here (e.g: pt-PT)..."} value={formData.language} onChange={handleChange} />

                                                    {errors.language && ShowAlert("danger", errors.language.message)}
                                                </div>

                                                <div className={"d-inline-block mx-auto mt-3"}>
                                                    <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>
                                                        {t('form.btnreset') ?? "Reset"}
                                                    </button>
                                                    <button className="btn btn-primary btnlog btn-rounded ms-3" type="submit" disabled={isSubmitting}>
                                                        {t('form.btnupdate') ?? "Update"}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>
                                        {tbtn('btnback') ?? "Back"}
                                    </Link>
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

export default withAuth(AdminSettings, ["admin"]);