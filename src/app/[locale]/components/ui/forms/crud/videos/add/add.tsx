/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import mime from 'mime/lite';
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useMySchemaVideos, type TFormVideos } from "@applocale/schemas/formSchemas";
import { buildMyConnection, getVideoImgPath, sendMessage } from "@applocale/functions/functions";
import { motion } from "framer-motion";
import { EditorState } from "lexical";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import ShowAlert from "@applocale/components/ui/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/ui/editor/myeditorpost";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import * as signalR from "@microsoft/signalr";

const AddVideosForm = () => {
    const getUserId = () => {
        return getFromStorage("loginStatus") ? JSON.parse(getFromStorage("loginStatus")!).userId : (getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : 1);
    }

    const t = useTranslations("ui.forms.crud.videos.add");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    const defSrc = `//vjs.zencdn.net/v/oceans.mp4`;

    const [formData, setFormData] = useState({
        src: defSrc,
        type: ""+mime.getType(defSrc)!,
        thumbnail: "/videos/thumbnails/default.jpg",
        title: "Demo",
        description: "This is a demo video",
        privacy: "public",
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryId: 1,
        userId: getUserId()
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [editorState, setEditorState] = useState("");
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [myEditorKey, setMyEditorKey] = useState("");
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

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

            return () => {
                connect.stop();
                connect.off("ReceiveMessage");
            }
        }

        if(getValues("src")) {
            setValue("type", ""+mime.getType(defSrc));
        }

        if (!!isResetedForm) {
            setFormData({
                src: defSrc,
                type: ""+mime.getType(defSrc)!,
                thumbnail: "/videos/thumbnails/default.jpg",
                title: "Demo",
                description: "This is a demo video",
                privacy: "public",
                isFeatured: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                categoryId: 1,
                userId: getUserId()
            });
            setIsResetedForm(false);
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if (!loading) {
            addMyRealData();
        }
    }, [isResetedForm, logInfo, loading, t, defSrc, setValue, getValues]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if(name === "src") {
            setValue("type", ""+mime.getType(value)!);
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
            console.log(formData);

            await FetchDataAxios({
                url: `api/medias`,
                method: 'post',
                data: {...formData, type: getValues("type")!},
                reqAuthorize: false
            }).then(async (r) => {
                console.log(r);
                setMyEditorKey(Date.now().toString());
                setDataToast({ type: "success", message: t("messages.success") ?? "The video info has been added sucessfully!", statusToast: true });

                setTimeout(async () => {
                    await sendMessage(connection!, r.data);
                    push("/" + locale);
                }, 1000 * 5);
            }).catch((err) => {
                setDataToast({ type: "error", message: t("messages.error", { message: "" + err }) ?? `Failed to add video info! Message: ${err}`, statusToast: true });
            });
        } catch (error) {
            setDataToast({ type: "error", message: t("messages.errorapi", { message: "" + error }) ?? `Error when adding video info! Message: ${error}`, statusToast: true });
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
                    {dataToast.statusToast && <Toasts id={"toastAddVideos"} data={dataToast} modeType={1} />}

                    <h3 className="title mx-auto text-center">
                        {t('title') ?? 'Add Videos'}
                    </h3>
                    <form className={"frmvideos " + styles.frmaddvideos}>
                        <div className="form-group mt-3 text-center">
                            <label htmlFor="src">
                                {t('lblsrc') ?? "Source url"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("src")} type="text" id="src" name="src" className={"form-control src mt-3 " + styles.sformgroupinp} placeholder={t("inpsrc") ?? "Write the source url here..."} value={formData.src} onChange={handleChange} required />
                            </div>

                            {errors.src && ShowAlert("danger", errors.src.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="type">
                                {t('lbltype') ?? "Type mime"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("type")} type="text" id="type" name="type" className={"form-control type mt-3 " + styles.sformgroupinp} placeholder={t("inptype") ?? "Write the type (mime) url here (e.g: video/mp4)..."} onChange={handleChange} disabled />
                            </div>

                            {errors.type && ShowAlert("danger", errors.type.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="thumbnail">
                                {t('lblthumbnail') ?? "Thumbnail url"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("thumbnail")} type="text" id="thumbnail" name="thumbnail" className={"form-control thumbnail mt-3 " + styles.sformgroupinp} placeholder={t("inpthumbnail") ?? "Write the thumbnail url here..."} value={formData.thumbnail} onChange={handleChange} />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    className="d-inline-block mt-3"
                                >
                                    <Image
                                        src={getVideoImgPath(formData.thumbnail)}
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
                                <MyEditorPost {...register("description")} keyid={myEditorKey} value={formData.description ?? editorState} editable={true} onChange={onChangeEditor} isCleared={isResetedForm} />
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
                            <div className="form-check form-switch">
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
                                {t('lbluserid') ?? "User Id:"}
                            </label>
                            <input {...register("userId")} type="number" name="userId" id="userId" className={"form-control userId mt-3 " + styles.sformgroup + " hidden"} value={getUserId() ?? 1} />
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="button" onClick={handleReset}>
                                {t("btnreset") ?? "Reset"}
                            </button>
                            <button className="btn btn-primary btnadd btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                {t("btnadd") ?? "Add"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default AddVideosForm;