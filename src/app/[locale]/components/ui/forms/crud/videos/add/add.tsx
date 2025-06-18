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
import { buildMyConnection, getVideoThumbnailPath, sendMessage } from "@applocale/functions/functions";
import { motion } from "framer-motion";
import { EditorState } from "lexical";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import { FilesMetadata } from "@applocale/interfaces/filesmetadata";
import Toasts from "@applocale/components/ui/toasts/toasts";
import ShowAlert from "@applocale/components/ui/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/ui/editor/myeditorpost";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import FetchData from "@applocale/utils/fetchdata";
import * as signalR from "@microsoft/signalr";

const AddVideosForm = () => {
    const getUserId = () => {
        return getFromStorage("loginStatus") ? JSON.parse(getFromStorage("loginStatus")!).userId : (getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : 1);
    }

    const t = useTranslations("ui.forms.crud.videos.add");
    const tupl = useTranslations("pages.AdminPages.MediaPage");

    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    const defTypeUrl = "local";
    const defMimeType = defTypeUrl == "local" ? "video/mp4" : "video/youtube";

    const [formData, setFormData] = useState({
        typeUrl: defTypeUrl,
        src: "",
        typeMime: "",
        thumbnail: "default.jpg",
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
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploadedFileSelected, setIsUploadedFileSelected] = useState(false);
    const [isUploadedFilesShown, setIsUploadedFilesShown] = useState(false);
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

        async function fetchUploadedFiles() {
            const response = await FetchData({
                url: "api/files/list",
                method: "GET"
            });

            setUploadedFiles(response);
        }

        if (getValues("typeUrl")) {
            setValue("src", getDefSrc(defTypeUrl));
        }

        if (getValues("src")) {
            setValue("typeMime", getValues("typeUrl") == "local" ? "" + (mime.getType(getDefSrc(defTypeUrl))! ?? defMimeType) : "video/youtube");
        }

        if (!!isResetedForm) {
            setFormData({
                typeUrl: defTypeUrl,
                src: getDefSrc(defTypeUrl),
                typeMime: "" + (mime.getType(getDefSrc(defTypeUrl))! ?? defMimeType),
                thumbnail: "default.jpg",
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
            fetchUploadedFiles();
        }
    }, [t, isResetedForm, logInfo, loading, defMimeType, setValue, getValues, defTypeUrl]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const getDefSrc = (typeurl: string = "local") => {
        return typeurl == 'local' ? `//vjs.zencdn.net/v/oceans.mp4` : "https://www.youtube.com/watch?v=Sklc_fQBmcs";
    };

    const getDefMimeType = (typeurl: string = "local", value: string) => {
        return typeurl == 'local' ? "" + (mime.getType(value)! ?? defMimeType) : "video/youtube";
    }

    const toggleIsUploadedFilesShown = () => {
        setIsUploadedFilesShown(!isUploadedFilesShown);
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "typeUrl") {
            setValue("src", getDefSrc(value))
        }

        if (name === "src") {
            setValue("typeMime", getDefMimeType(getValues("typeUrl"), getDefSrc(value)));
        }
    }

    const handleReset = (e: any) => {
        e.preventDefault();
        setIsResetedForm(true);
        setIsUploadedFileSelected(false);
        setValue("typeUrl", defTypeUrl);
        setFormData({ ...formData, ["description"]: formData.description });
        setMyEditorKey(Date.now().toString());
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            console.log(formData);

            await FetchDataAxios({
                url: `api/medias`,
                method: 'post',
                data: {
                    ...formData,
                    ["typeMime"]: getDefMimeType(getValues("typeUrl"), getDefSrc(getValues("typeUrl"))),
                    ["src"]: getValues("src")
                },
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
                console.log(err.response)
                setDataToast({ type: "error", message: t("messages.error", { message: "" + (err.response.data ?? err.Message) }) ?? `Failed to add video info! Message: ${err.response.data ?? err.Message}`, statusToast: true });
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

    const selUplFile = (e: any, fname: FilesMetadata) => {
        e.preventDefault();
        setIsUploadedFileSelected(!isUploadedFileSelected);

        if(!isUploadedFileSelected) {
            setValue("src", "https://localhost:5000/assets/uploads/" + fname.fileName);
            setValue("typeMime", getValues("typeUrl") == "local" ? "" + (mime.getType(fname.contentType)! ?? defMimeType) : "video/youtube");
        } else {
            setValue("src", getDefSrc(defTypeUrl));
            setValue("typeMime", getValues("typeUrl") == "local" ? "" + (mime.getType(getDefSrc(defTypeUrl))! ?? defMimeType) : "video/youtube");
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
                    {dataToast.statusToast && <Toasts id={"toastAddVideos"} data={dataToast} modeType={1} />}

                    <h3 className="title mx-auto text-center">
                        {t('title') ?? 'Add Videos'}
                    </h3>

                    <form className={"frmvideos " + styles.frmaddvideos}>
                        {uploadedFiles && (
                            <>
                                {formData.typeUrl == "local" && (
                                    <div className="d-inline-block mx-auto mt-3">
                                        <button type="button" className="btn btn-primary btn-rounded btn-tp w-auto" onClick={toggleIsUploadedFilesShown}>
                                            Toggle uploads
                                        </button>
                                    </div>
                                )}

                                <div className={"mlistuplfiles form-group mt-3 text-center" + (isUploadedFilesShown ? " shown" : " hidden")}>
                                    <div className={"mlistuplfilesbody " + styles.sformgroup}>
                                        <div className="row">
                                            {uploadedFiles.length == 0 && (
                                                <div className="col-12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <i className="bi bi-file-earmark-post" style={{ fontSize: '2rem' }}></i>
                                                            <p>{tupl('results.nofilesuploaded') ?? "No files uploaded yet."}</p>
                                                            <Link href={"/"+locale+"/pages/admin/dashboard/media"} className="btn btn-primary btn-tp btn-rounded mt-3">
                                                                Visit here...
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {uploadedFiles.length > 0 && uploadedFiles.map((file: FilesMetadata, index) => (
                                                <div key={"listupl" + index} className={"col-6 col-lg-4" + (isUploadedFileSelected ? " selected" : "")} onClick={(e) => selUplFile(e, file)}>
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="d-inline-block"
                                                    >
                                                        <div className="card carduplfiles cardlg rounded bshadow">
                                                            <Image
                                                                src={getVideoThumbnailPath(formData.thumbnail)}
                                                                width="400"
                                                                height="400"
                                                                alt=""
                                                                className={"mlistuplfileimg img-fluid"}
                                                                onError={(event: any) => {
                                                                    event.target.id = "/videos/thumbnails/default.jpg";
                                                                    event.target.srcset = "/videos/thumbnails/default.jpg";
                                                                }}
                                                                priority
                                                            />

                                                            <div className="card-body">
                                                                <div className="scard-body">
                                                                    <div className={"card-info"}>
                                                                        <div className="card-text p-3">
                                                                            <h5 className="card-title">{file.fileName}</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

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
                                <input {...register("src")} type="text" id="src" name="src" className={"form-control src mt-3 " + styles.sformgroupinp} placeholder={t("inpsrc") ?? "Write the source url here..."} onChange={handleChange} required />
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
                                        src={getVideoThumbnailPath(formData.thumbnail)}
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