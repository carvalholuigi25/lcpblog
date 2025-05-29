/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useMySchemaNews, type TFormNews } from "@applocale/schemas/formSchemas";
import { buildMyConnection, getImagePath, sendMessage } from "@applocale/functions/functions";
import { motion } from "framer-motion";
import { EditorState } from "lexical";
import { Link } from '@/app/i18n/navigation';
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import Toasts from "@applocale/components/ui/toasts/toasts";
import ShowAlert from "@applocale/components/ui/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/ui/editor/myeditorpost";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import * as signalR from "@microsoft/signalr";
import { DataToastsProps } from "@applocale/interfaces/toasts";

const AddNewsForm = () => {
    const t = useTranslations("ui.forms.crud.news.add");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "blog.jpg",
        slug: "/news/1",
        status: "0",
        categoryId: 1,
        userId: 1,
        tags: ["#geral"]
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [editorState, setEditorState] = useState("");
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [listCategories, setListCategories] = useState([]);
    const [listTags, setListTags] = useState([]);
    const [tagsVal, setTagsVal] = useState(['#geral']);
    const [myEditorKey, setMyEditorKey] = useState("");
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
        watch
    } = useForm<TFormNews>({
        resolver: zodResolver(useMySchemaNews()),
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

        async function getCategories() {
            try {
                await FetchDataAxios({
                    url: `api/categories`,
                    method: 'get',
                    reqAuthorize: false
                }).then((r) => {
                    console.log(t("messages.success") ?? "Fetched categories successfully!");
                    setListCategories(r.data.data ?? r.data);
                }).catch((err) => {
                    console.log(t("messages.error", { message: "" + err }) ?? `Failed to fetch categories. Message: ${err}`);
                });
            } catch (error) {
                console.log(t("messages.errorapi", { message: "" + error }) ?? `An error occurred while fetching categories! Message: ${error}`);
            }
        }

        async function getTags() {
            try {
                await FetchDataAxios({
                    url: `api/tags`,
                    method: 'get',
                    reqAuthorize: false
                }).then((r) => {
                    console.log("Fetched tags successfully");
                    setListTags(r.data.data ?? r.data);
                }).catch((err) => {
                    console.log("Failed to fetch tags. Message: " + err);
                });
            } catch (error) {
                console.log("An error occurred while fetching tags! Message: " + error);
            }
        }

        getCategories();
        getTags();

        if (!!isResetedForm) {
            setFormData({
                title: "",
                content: "",
                image: "blog.jpg",
                slug: "/news/1",
                status: "0",
                categoryId: 1,
                userId: getUserId() ?? 1,
                tags: ["#geral"]
            });
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if (!loading) {
            addMyRealData();
        }
    }, [isResetedForm, logInfo, loading, t]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const getUserId = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : null;
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                url: `api/posts`,
                method: 'post',
                data: formData,
                reqAuthorize: false
            }).then(async (r) => {
                console.log(r);
                setMyEditorKey(Date.now().toString());
                setDataToast({ type: "success", message: t("messages.addsuccess") ?? "The news post has been added sucessfully!", statusToast: true });

                setTimeout(async () => {
                    await sendMessage(connection!, r.data);
                    push("/" + locale);
                }, 1000 * 5);
            }).catch((err) => {
                setDataToast({ type: "error", message: t("messages.adderror", { message: "" + err }) ?? `Failed to add news post! Message: ${err}`, statusToast: true });
            });
        } catch (error) {
            setDataToast({ type: "error", message: t("messages.adderrorapi", { message: "" + error }) ?? `Error when adding news post! Message: ${error}`, statusToast: true });
        }
    }

    const onChangeEditor = (editorState: EditorState) => {
        const editorStateJSON = JSON.stringify(editorState.toJSON());
        setEditorState(editorStateJSON);
        setFormData({ ...formData, content: editorStateJSON });
    }

    const onChangeTagList = (e: any) => {
        console.log(e)
        const values: any = Array.from(e.target.selectedOptions, (option: any) => option.value);
        const nval: any = [...new Set(values)];
        setTagsVal(nval);
    };

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
                    {dataToast.statusToast && <Toasts id={"toastAddNews"} data={dataToast} />}

                    <h3 className="title mx-auto text-center">
                        {t('title') ?? 'Add news'}
                    </h3>
                    <form className={styles.frmaddnews}>
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
                            <label htmlFor="content">
                                {t('lblcontent') ?? "Content"}
                            </label>
                            <div className={styles.sformgroup}>
                                <MyEditorPost {...register("content")} keyid={myEditorKey} value={formData.content ?? editorState} editable={true} onChange={onChangeEditor} isCleared={isResetedForm} />
                            </div>

                            {errors.content && ShowAlert("danger", errors.content.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="image">
                                {t('lblimage') ?? "Image Url:"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("image")} type="text" id="image" name="image" className={"form-control image mt-3 " + styles.sformgroupinp} placeholder={t("inpimage") ?? "Write the image url here..."} value={formData.image} onChange={handleChange} />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    className="d-inline-block mt-3"
                                >
                                    <Image
                                        src={getImagePath(formData.image)}
                                        width="600"
                                        height="300"
                                        alt="News image"
                                        className={styles.inpimgprev + " " + styles.inpimgprevcover}
                                        onError={(event: any) => {
                                            event.target.id = "/images/blog.jpg";
                                            event.target.srcset = "/images/blog.jpg";
                                        }}
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {errors.image && ShowAlert("danger", errors.image.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="slug">
                                {t('lblslug') ?? "Slug Url:"}
                            </label>
                            <div className={styles.sformgroup}>
                                <input {...register("slug")} type="text" id="slug" name="slug" className={"form-control slug mt-3 " + styles.sformgroupinp} placeholder={t("inpslug") ?? "Write the slug url here..."} value={formData.slug} onChange={handleChange} />
                            </div>

                            {errors.slug && ShowAlert("danger", errors.slug.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="categoryId">
                                {t('lblcategory') ?? "Category:"}
                            </label>
                            <div className={styles.sformgroup}>
                                <select {...register("categoryId")} id="categoryId" name="categoryId" className={"form-control categoryId mt-3 " + styles.sformgroupinp} value={formData.categoryId} onChange={handleChange}>
                                    <option disabled>
                                        {t('listcategories.options.sel') ?? "Select the option of category"}
                                    </option>

                                    {!!listCategories && listCategories.map((category: Categories) => (
                                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                                    ))}

                                    {!listCategories && <option value={1}>{t('listcategories.options.general') ?? "General"}</option>}
                                </select>
                            </div>

                            {errors.categoryId && ShowAlert("danger", errors.categoryId.message)}
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

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="userId" className="hidden">
                                {t('lbluserId') ?? "User Id:"}
                            </label>
                            <input {...register("userId")} type="number" name="userId" id="userId" className={"form-control userId mt-3 " + styles.sformgroup + " hidden"} value={getUserId() ?? 1} />
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="tags">{t("lbltags") ?? "Tags:"}</label>
                            <select className="form-control tags mt-3 p-3" id="tags" value={tagsVal} multiple onChange={onChangeTagList}>
                                <option value={""} disabled>{t("seltags") ?? "Select the tag(s)"}</option>
                                {listTags && listTags.length > 0 && listTags.map((x: any, i: number) => (
                                    <option key={i} value={x.name}>{x.name}</option>
                                ))}

                                {!listTags || listTags.length == 0 && (
                                    <option key={0} value={"#geral"}>#geral</option>
                                )}
                            </select>
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

export default AddNewsForm;