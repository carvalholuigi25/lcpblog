/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import mime from 'mime/lite';
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMySchemaVideos, type TFormVideos } from "@applocale/schemas/formSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { Link } from '@/app/i18n/navigation';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EditorState } from "lexical";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale, useTranslations } from "next-intl";
import { buildMyConnection, getVideoThumbnailPath, sendMessage } from "@applocale/functions/functions";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import { Media } from "@applocale/interfaces/media";
import ShowAlert from "@applocale/components/ui/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/ui/editor/myeditorpost";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import Toasts from "@applocale/components/ui/toasts/toasts";

const EditVideosForm = ({mediaId, data}: {mediaId: number, data: Media}) => {
    const getUserId = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : 1;
    }

    const t = useTranslations("ui.forms.crud.videos.edit");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    const defTypeUrl = "local";
    const defSrc = defTypeUrl == 'local' ? `//vjs.zencdn.net/v/oceans.mp4` : "https://www.youtube.com/watch?v=Sklc_fQBmcs";
    const defMimeType = defTypeUrl == "local" ? "video/mp4" : "video/youtube";

    const [formData, setFormData] = useState({
        mediaId: data.mediaId ?? mediaId,
        typeUrl: data.typeUrl ?? defTypeUrl,
        src: data.src ?? defSrc,
        typeMime: data.typeMime ?? (mime.getType(defSrc) ?? defMimeType),
        thumbnail: data.thumbnail ?? "default.jpg",
        title: data.title ?? "Demo",
        description: data.description ?? "This is a demo video",
        privacy: data.privacy ?? "public",
        isFeatured: data.isFeatured ?? false,
        createdAt: data.createdAt ?? new Date().toISOString(),
        updatedAt: data.updatedAt ?? new Date().toISOString(),
        categoryId: data.categoryId ?? 1,
        userId: data.userId ?? getUserId()
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [editorState, setEditorState] = useState("");
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [myEditorKey, setMyEditorKey] = useState("");
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [loading, setLoading] = useState(true);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
    
    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        getValues
    } = useForm<TFormVideos>({
        resolver: zodResolver(useMySchemaVideos()),
    });

    watch();

    useEffect(() => {
        async function updateMyRealData() {
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
                console.log("message updated");
            });
        
            return () => {
                connect.stop();
                connect.off("ReceiveMessage");
            };
        }

        if(getValues("src")) {
            setValue("typeMime", defTypeUrl == "local" ? ""+(mime.getType(defSrc) ?? defMimeType) : "");
        }

        if(!!isResetedForm) {
            setFormData({
                mediaId: data.mediaId ?? mediaId,
                typeUrl: data.typeUrl ?? defTypeUrl,
                src: data.src ?? defSrc,
                typeMime: data.typeMime ?? (mime.getType(defSrc) ?? defMimeType),
                thumbnail: data.thumbnail ?? "default.jpg",
                title: data.title ?? "Demo",
                description: data.description ?? "This is a demo video",
                privacy: data.privacy ?? "public",
                isFeatured: data.isFeatured ?? false,
                createdAt: data.createdAt ?? new Date().toISOString(),
                updatedAt: data.updatedAt ?? new Date().toISOString(),
                categoryId: data.categoryId ?? 1,
                userId: data.userId ?? getUserId()
            });
            setIsResetedForm(false);
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if(!loading) {
            updateMyRealData();
            setMyEditorKey(Date.now().toString());
        }
    }, [data, mediaId, isResetedForm, logInfo, loading, defSrc, defMimeType, getValues, setValue]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if(name === "src") {
            setValue("typeMime", ""+(mime.getType(value)! ?? defMimeType));
        }
    }

    const handleReset = (e: any) => {
        e.preventDefault();
        setIsResetedForm(true);
        setMyEditorKey(Date.now().toString());
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/medias/${mediaId}`,
                method: 'put',
                data: formData
            }).then(async (r) => {
                console.log(r);
                setMyEditorKey(Date.now().toString());
                setDataToast({type: "success", message: t("messages.success") ?? "Video info edited successfully!", statusToast: true});

                setTimeout(async () => {
                    await sendMessage(connection!, r.data);
                    push("/"+locale);
                }, 1000 * 5);
            }).catch((err) => {
                setDataToast({type: "error", message: t("messages.error", {message: ""+err}) ?? `Error when editing video info! Message: ${err}`, statusToast: true});
            });
        } catch (error) {
            setDataToast({type: "error", message: t("messages.errorapi", {message: ""+error}) ??  `Occurred an error when trying to edit the video info! Message: ${error}`, statusToast: true});
        }
    }
    
    const onChangeEditor = (editorState: EditorState) => {
        const editorStateJSON = JSON.stringify(editorState.toJSON());
        setEditorState(editorStateJSON);
        setFormData({ ...formData, description: editorStateJSON });
    }

    const toggleIsFeatured = (e: any) => {
        setFormData({ ...formData, ["isFeatured"]: e.target.checked });
    }

    return (
        <div className="container">
            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{marginTop: '3rem'}}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{fontSize: '4rem'}} />
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
                    {dataToast.statusToast && <Toasts id={"toastEditVideos"} data={dataToast} modeType={1} />}

                    <h3 className="title mx-auto text-center">
                        {t("title") ?? "Edit Videos"}
                    </h3>
                    <form className={"frmvideos " + styles.frmeditvideos}>
                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="mediaId">
                                {t('lblmediaid') ?? "Media id"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("mediaId")} type="number" id="mediaId" name="mediaId" className={"form-control mediaId mt-3 " + styles.sformgroupinp} placeholder={t("inpmediaid") ?? "Write the media id here..."} value={formData.mediaId} onChange={handleChange} />
                            </div>

                            {errors.mediaId && ShowAlert("danger", errors.mediaId.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="typeUrl">
                                {t('lbltypeurl') || "Type url"}
                            </label>
                            <div className={styles.sformgroup}>
                                <select {...register("typeUrl")} id="typeUrl" name="typeUrl" className={"form-control typeUrl mt-3 " + styles.sformgroupinp} value={formData.typeUrl} onChange={handleChange}>
                                    <option disabled>{t('seltypeurl.options.optdef') || "Select the option of type url"}</option>
                                    <option value={"local"}>
                                        {t('seltypeurl.options.opt1') || "Local"}
                                    </option>
                                    <option value={"external"}>
                                        {t('seltypeurl.options.opt2') || "External"}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="src">
                                {t('lblsrc') ?? "Source url"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("src")} type="text" id="src" name="src" className={"form-control src mt-3 " + styles.sformgroupinp} placeholder={t("inpsrc") ?? "Write the source url here..."} value={formData.src} onChange={handleChange} required />
                            </div>

                            {errors.src && ShowAlert("danger", errors.src.message)}
                        </div>

                        {formData.typeUrl == "local" && (
                            <div className="form-group mt-3 text-center">
                                <label htmlFor="typeMime">
                                    {t('lbltypemime') ?? "Type mime"}
                                </label>
                                <div className={styles.sformgroup}>
                                    <input {...register("typeMime")} type="text" id="typeMime" name="typeMime" className={"form-control typeMime mt-3 " + styles.sformgroupinp} placeholder={t("inptypemime") ?? "Write the type (mime) url here (e.g: video/mp4)..."} onChange={handleChange} disabled />
                                </div>

                                {errors.typeMime && ShowAlert("danger", errors.typeMime.message)}
                            </div>
                        )}

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="thumbnail">
                                {t('lblthumbnail') ?? "Thumbnail url:"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("thumbnail")} type="text" id="thumbnail" name="thumbnail" className={"form-control thumbnail mt-3 " + styles.sformgroupinp} placeholder={t("inpthumbnail") ?? "Write the thumbnail url here..."} value={formData.thumbnail} onChange={handleChange} />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    className="d-inline-block mt-3"
                                >
                                    <Image
                                        src={getVideoThumbnailPath(formData.thumbnail!.replace("videos/", ""))}
                                        width="600"
                                        height="300"
                                        alt="Videos thumbnail"
                                        className={styles.inpimgprev + " " + styles.inpimgprevcover + " rounded"}
                                        onError={(event: any) => {
                                            event.target.id = "/videos/thumbnails/default.jpg";
                                            event.target.srcset = "/videos/thumbnails/default.jpg";
                                        }}
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {errors.thumbnail && ShowAlert("danger", errors.thumbnail.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="title">
                                {t('lbltitle') ?? "Title"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("title")} type="text" id="title" name="title" className={"form-control title mt-3 " + styles.sformgroupinp} placeholder={t("inptitle") ?? "Write the title here..."} value={formData.title} onChange={handleChange} required />
                            </div>

                            {errors.title && ShowAlert("danger", errors.title.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="description">
                                {t('lbldesc') ?? "Description"}
                            </label>
                            <div className={styles.sformgroup}>
                                <MyEditorPost {...register("description")} keyid={myEditorKey} value={formData.description ?? editorState} editable={true} onChange={onChangeEditor} isCleared={isResetedForm} showStatus={true} />
                            </div>

                            {errors.description && ShowAlert("danger", errors.description.message)}
                        </div>

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="privacy" className="hidden">
                                {t('lblprivacy') ?? "Privacy:"}
                            </label>
                            <div className={styles.sformgroup + " hidden"}>
                                <select {...register("privacy")} id="privacy" name="privacy" className={"form-control privacy mt-3 hidden " + styles.sformgroupinp} value={formData.privacy} onChange={handleChange}>
                                    <option disabled>{t('selprivacy.options.optdef') ?? "Select the option of privacy"}</option>
                                    <option value={"public"}>
                                        {t('selprivacy.options.opt1') ?? "Public"}
                                    </option>
                                    <option value={"private"}>
                                        {t('selprivacy.options.opt2') ?? "Private"}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group mt-3 text-center">
                            <div className="myformswitch form-check form-switch">
                                <div className="colleft">
                                    <label className="form-check-label" htmlFor="isFeatured">
                                        {t('lblisfeatured') ?? "Is featured?"}
                                    </label>
                                </div>
                                <div className="colright">
                                    <input {...register("isFeatured")} type="checkbox" role="switch" id="isFeatured" name="isFeatured" className={"form-control form-check-input isFeatured sformgroupinp medium"} placeholder={t("inpisfeatured") ?? "Check the featured status here..."} checked={formData.isFeatured} onChange={toggleIsFeatured} />
                                </div>
                            </div>

                            {errors.isFeatured && ShowAlert("danger", errors.isFeatured.message)}
                        </div>

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="categoryId">
                                {t('lblcategoryid') ?? "Category id"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("categoryId")} type="number" id="categoryId" name="categoryId" className={"form-control categoryId mt-3 " + styles.sformgroupinp} placeholder={t("inpcategoryid") ?? "Write the category id here..."} value={formData.categoryId} onChange={handleChange} />
                            </div>

                            {errors.categoryId && ShowAlert("danger", errors.categoryId.message)}
                        </div>

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="userId" className="hidden">
                                {t('lbluserid') ?? "User id:"}
                            </label>
                            <input {...register("userId")} type="number" name="userId" id="userId" className={"form-control userId mt-3 " + styles.sformgroup + " hidden"} value={getUserId() ?? 1} />
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="button" onClick={handleReset}>
                                {t("btnreset") ?? "Reset"}
                            </button>
                            <button className="btn btn-primary btnedit btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                {t("btnedit") ?? "Edit"}
                            </button>
                        </div>
                    </form>
                </>
            )}  
        </div>
    );
}

export default EditVideosForm;