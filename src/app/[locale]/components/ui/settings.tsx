/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import { saveToStorage } from "@applocale/hooks/localstorage";
import { getMyCustomLanguages } from "@applocale/components/ui/languageswitcher";
import { LanguagesLocales } from "@/app/i18n/locales";
import { TFormSettings, useMySchemaSettings } from "@applocale/schemas/formSchemas";
import { GetMySpecialCustomThemes, ThemesModel } from "./themeswitcher";
import ShowAlert from "@applocale/components/ui/alerts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import * as config from "@applocale/utils/config";

export default function SettingsComp() {
    const t = useTranslations("ui.settings");

    const [isSettingsEnabled, setIsSettingsEnabled] = useState(true);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAutoSaved, setIsAutoSaved] = useState(false);
    const specialthemes: ThemesModel[] = GetMySpecialCustomThemes();
    const languagesary: LanguagesLocales[] = getMyCustomLanguages();
    const router = useRouter();

    const formRef = useRef<any>(null);
    const delay = 1000 * 5;
    let typingTimer: any;

    const [formData, setFormData] = useState({
        theme: config.getConfigSync().theme ?? "glassmorphism",
        language: config.getConfigSync().language ?? "pt-PT",
        isBordered: config.getConfigSync().isBordered ?? true,
        is3DEffectsEnabled: config.getConfigSync().is3DEffectsEnabled ?? false,
        isAutoSaveEnabled: config.getConfigSync().isAutoSaveEnabled ?? false
    });

    const [dataToast, setDataToast] = useState({
        type: "",
        message: "",
        statusToast: false
    } as DataToastsProps);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TFormSettings>({
        resolver: zodResolver(useMySchemaSettings()),
    });

    const autoSubmitAfterTyping = useCallback(() => {
        if(!isLoading && isAutoSaved) {
            const refid = setTimeout(() => {
                formRef.current.requestSubmit();
            }, delay);

            return () => {
                clearTimeout(refid);
                clearTimeout(typingTimer);
            }
        }
    }, [isAutoSaved, isLoading, typingTimer, delay]);

    useEffect(() => {
        setIsLoading(false);

        if (!!isResetedForm) {
            setFormData({
                theme: config.getConfigSync().theme ?? "glassmorphism",
                language: config.getConfigSync().language ?? "pt-PT",
                isBordered: config.getConfigSync().isBordered ?? true,
                is3DEffectsEnabled: config.getConfigSync().is3DEffectsEnabled ?? false,
                isAutoSaveEnabled: config.getConfigSync().isAutoSaveEnabled ?? false
            });
        }

        autoSubmitAfterTyping();
    }, [isResetedForm, isLoading, isAutoSaved, typingTimer, router, autoSubmitAfterTyping]);

    if (isLoading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const toggleSettings = (e: any) => {
        setIsSettingsEnabled(e.target.checked);
    }

    const toggleAutoSaveSetting = (e: any) => {
        setIsAutoSaved(true);
        setFormData({ ...formData, ["isAutoSaveEnabled"]: e.target.checked });
    }

    const toggle3DEffects = (e: any) => {
        if(formData.isAutoSaveEnabled) {
            setIsAutoSaved(true);
        }
        
        setFormData({ ...formData, ["is3DEffectsEnabled"]: e.target.checked });
    }

    const toggleBorderedEffect = (e: any) => {
        if(formData.isAutoSaveEnabled) {
            setIsAutoSaved(true);
        }

        setFormData({ ...formData, ["isBordered"]: e.target.checked });
    }

    const handleReset = () => {
        setIsResetedForm(true);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

        if(formData.isAutoSaveEnabled) {
            setIsAutoSaved(true);
        }
    };

     const handleUpdKeyTheme = (e: any) => {
        e.preventDefault();

        if(specialthemes.length > 0) {
            if (formData.theme && specialthemes.filter(x => x.theme.includes(formData.theme)).length == 1) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    setIsAutoSaved(true);
                }, delay);
            }
        }
    }

    const handleUpdKeyLang = (e: any) => {
        e.preventDefault();

        if (languagesary.length > 0) {
            if (formData.language && languagesary.filter(x => x.value.includes(formData.language)).length == 1) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    setIsAutoSaved(true);
                }, delay);
            }
        }
    }

    const onSubmit = async () => {
        if(formData.theme.length == 0) {
            setDataToast({
                type: "error",
                message: t("form.apimessages.error", { message: "The theme name should be provided." }) ?? `Failed to update the settings! Message: The theme name should be provided.`,
                statusToast: true
            });
            location.reload();
            return false;
        }

        if(formData.language.length == 0) {
            setDataToast({
                type: "error",
                message: t("form.apimessages.error", { message: "The language name should be provided." }) ?? `Failed to update the settings! Message: The language name should be provided.`,
                statusToast: true
            });
            location.reload();
            return false;
        }

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
            saveToStorage("language", ""+formData.language);
            
            setDataToast({
                type: "success",
                message: t("form.apimessages.success") ?? "Updated the new settings!",
                statusToast: true
            });

            router.push("/");
        }).catch((e) => {
            console.log(e);
            const msg = e.response.data.error ?? e.message;
            
            setDataToast({
                type: "error",
                message: t("form.apimessages.error", { message: msg }) ?? `Failed to update the settings! Message: ${msg}`,
                statusToast: true
            });

            router.push("/");
        });
    }

    return (
        <>
            {dataToast.statusToast && <Toasts id={"toastUpdateSettings"} data={dataToast} modeType={1} />}

            <div className="mfrmsettings">
                <form className="frmensettings">
                    <div className={"form-group mt-3 text-center"}>
                        <div className="myformswitch form-check form-switch">
                            <div className="colleft">
                                <label className="form-check-label" htmlFor="ensettings">{t('form.lblensettings') ?? "Is Settings Enabled?"}</label>
                            </div>
                            <div className="colright">
                                <input type="checkbox" role="switch" id="inpensettings" name="inpensettings" className={"form-control form-check-input inpensettings sformgroupinp medium"} placeholder={t('form.inpensettings') ?? "Toggle the settings"} checked={isSettingsEnabled} onChange={toggleSettings} />
                            </div>
                        </div>
                    </div>
                    <div className={"form-group mt-3 text-center"}>
                        <div className="myformswitch form-check form-switch">
                            <div className="colleft">
                                <label className="form-check-label" htmlFor="autosavesetting">{t('form.lblautosavesetting') ?? "Auto Save Enabled?"}</label>
                            </div>
                            <div className="colright">
                                <input {...register("isAutoSaveEnabled")} type="checkbox" role="switch" id="inpautosavesetting" name="inpautosavesetting" className={"form-control form-check-input inpautosavesetting sformgroupinp medium"} placeholder={t('form.inpautosavesetting') ?? "Toggle the auto save setting"} checked={formData.isAutoSaveEnabled} onChange={toggleAutoSaveSetting} />
                            </div>
                        </div>
                    </div>
                </form>

                <form ref={formRef} className={"frmsettings " + (!isSettingsEnabled ? "hidden" : "")} onSubmit={handleSubmit(onSubmit)}>
                    <div className={"form-group mt-3 text-center"}>
                        <div className="myformswitch formsel">
                            <div className="colleft">
                                <label htmlFor="theme">{t('form.lbltheme') ?? "Theme"}</label>
                            </div>
                            <div className="colright">
                                <input {...register("theme")} type="text" id="theme" name="theme" list="dttheme" className={"form-control theme w-auto mt-3 sformgroupinp"} placeholder={t('form.inptheme') ?? "Write the theme name here... (e.g: glassmorphism)"} value={formData.theme} onChange={handleChange} onInput={handleUpdKeyTheme} required />

                                {specialthemes && (
                                    <datalist id="dttheme">
                                        {specialthemes.map((x, i) => (
                                            <option key={i} value={x.theme}>{x.theme}</option>
                                        ))}
                                    </datalist>
                                )}
                            </div>
                        </div>

                        {errors.theme && ShowAlert("danger", errors.theme.message)}
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className={"form-group mt-3 text-center"}>
                                <div className="myformswitch form-check form-switch">
                                    <div className="colleft">
                                        <label className="form-check-label" htmlFor="3deffects">{t('form.lbl3deffects') ?? "Is 3D Effects Enabled?"}</label>
                                    </div>
                                    <div className="colright">
                                        <input {...register("is3DEffectsEnabled")} type="checkbox" role="switch" id="inp3deffects" name="inp3deffects" className={"form-control form-check-input inp3deffects sformgroupinp medium"} placeholder={t('form.inp3deffects') ?? "Check the 3D effects"} checked={formData.is3DEffectsEnabled} onChange={toggle3DEffects} />
                                    </div>
                                </div>

                                {errors.is3DEffectsEnabled && ShowAlert("danger", errors.is3DEffectsEnabled.message)}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className={"form-group mt-3 text-center"}>
                                <div className="myformswitch form-check form-switch">
                                    <div className="colleft">
                                        <label className="form-check-label" htmlFor="isBordered">{t('form.lblbordered') ?? "Is Bordered Enabled?"}</label>
                                    </div>
                                    <div className="colright">
                                        <input {...register("isBordered")} type="checkbox" role="switch" id="inpbordered" name="inpbordered" className={"form-control form-check-input inpbordered sformgroupinp medium"} placeholder={t('form.inpbordered') ?? "Check the bordered effect"} checked={formData.isBordered} onChange={toggleBorderedEffect} />
                                    </div>
                                </div>

                                {errors.isBordered && ShowAlert("danger", errors.isBordered.message)}
                            </div>
                        </div>
                    </div>

                    <div className="clearfix"></div>

                    <div className={"form-group mt-3 text-center"}>
                        <div className="myformswitch formsel">
                            <div className="colleft">
                                <label htmlFor="language">{t('form.lbllanguage') ?? "Language"}</label>
                            </div>
                            <div className="colright">
                                <input {...register("language")} type="text" id="language" name="language" list="dtlang" className={"form-control language w-auto mt-3 sformgroupinp"} placeholder={t('form.inplanguage') ?? "Write the language name here (e.g: pt-PT)..."} value={formData.language} onChange={handleChange} onInput={handleUpdKeyLang} />
                                {languagesary && (
                                    <datalist id="dtlang">
                                        {languagesary.map((x, i) => (
                                            <option key={i} value={x.value}>{x.value}</option>
                                        ))}
                                    </datalist>
                                )}
                            </div>
                        </div>

                        {errors.language && ShowAlert("danger", errors.language.message)}
                    </div>

                    <div className={"d-inline-block mx-auto mt-3"}>
                        <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>
                            {t('form.btnreset') ?? "Reset"}
                        </button>
                        <button className={"btn btn-primary btnupdate btn-rounded ms-3 " + (formData.isAutoSaveEnabled ? "hidden" : "")} type="submit" disabled={isSubmitting && !formData.isAutoSaveEnabled}>
                            {t('form.btnupdate') ?? "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}