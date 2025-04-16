/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMySchemaNews, type TFormNews } from "@applocale/schemas/formSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Posts } from "@applocale/interfaces/posts";
import { EditorState } from "lexical";
import { buildMyConnection, getImagePath, sendMessage } from "@applocale/functions/functions";
import { Link } from '@/app/i18n/navigation';
import { Categories } from "@applocale/interfaces/categories";
import { getDefLocale } from "@applocale/helpers/defLocale";
import ShowAlert from "@applocale/components/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/editor/myeditorpost";
import LoadingComp from "@applocale/components/loadingcomp";

const EditNewsForm = ({id, data}: {id: number, data: Posts}) => {
    const [formData, setFormData] = useState({
        postId: data.postId ?? 1,
        title: data.title ?? "",
        content: data.content ?? "",
        image: data.image ?? "blog.jpg",
        slug: data.slug ?? "/news/1",
        status: data.status ?? "0",
        categoryId: data.categoryId ?? 1,
        userId: data.userId ?? 1,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [editorState, setEditorState] = useState("");
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [listCategories, setListCategories] = useState([]);
    const [myEditorKey, setMyEditorKey] = useState("");
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [loading, setLoading] = useState(true);
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
        
            return () => connect.stop();
        }

        async function getCategories() {
            try {
                await FetchDataAxios({
                    url: `api/categories`,
                    method: 'get',
                    reqAuthorize: false
                }).then((r) => {
                    setListCategories(r.data.data ?? r.data);
                }).catch((err) => {
                    console.error(err);
                });
            }
            catch (error) {
                console.error(error);
            }
        }

        getCategories();

        if(!!isResetedForm) {
            setFormData({
                postId: data.postId ?? 1,
                title: data.title ?? "",
                content: data.content ?? "",
                image: data.image ?? "blog.jpg",
                slug: data.slug ?? "/news/1",
                status: data.status ?? "0",
                categoryId: data.categoryId ?? 1,
                userId: getUserId() ?? data.userId ?? 1,
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if(!loading) {
            updateMyRealData();
            setMyEditorKey(Date.now().toString());
        }
    }, [isResetedForm, logInfo, data, loading]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const getUserId = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : null;
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = (e: any) => {
        e.preventDefault();
        setIsResetedForm(true);
        setMyEditorKey(Date.now().toString());
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/posts/`+id,
                method: 'put',
                data: formData
            }).then(async (r) => {
                console.log(r);
                setMyEditorKey(Date.now().toString());

                setTimeout(async () => {
                    alert("The news post (id: "+id+") has been updated sucessfully!");
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
    
    const onChangeEditor = (editorState: EditorState) => {
        const editorStateJSON = JSON.stringify(editorState.toJSON());
        setEditorState(editorStateJSON);
        setFormData({ ...formData, content: editorStateJSON });
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
                    <h3 className="title mx-auto text-center">Edit news</h3>
                    <form className={styles.frmeditnews}>
                        <div className="form-group mt-3 text-center">
                            <label htmlFor="title">Title</label>
                            <div className={styles.sformgroup}>
                                <input {...register("title")} type="text" id="title" name="title" className={"form-control title mt-3 " + styles.sformgroupinp} placeholder="Write your title here..." value={formData.title} onChange={handleChange} required />
                            </div>

                            {errors.title && ShowAlert("danger", errors.title.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="content">Content</label>
                            <div className={styles.sformgroup}>
                                <MyEditorPost {...register("content")} keyid={myEditorKey} value={formData.content ?? editorState} editable={true} onChange={onChangeEditor} isCleared={isResetedForm} />
                            </div>

                            {errors.content && ShowAlert("danger", errors.content.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="image">Image Url:</label>
                            <div className={styles.sformgroup}>
                                <input {...register("image")} type="text" id="image" name="image" className={"form-control image mt-3 " + styles.sformgroupinp} placeholder="Write your image url here..." value={formData.image} onChange={handleChange} />
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
                            <label htmlFor="slug">Slug Url:</label>
                            <div className={styles.sformgroup}>
                                <input {...register("slug")} type="text" id="slug" name="slug" className={"form-control slug mt-3 " + styles.sformgroupinp} placeholder="Write your slug url here..." value={formData.slug} onChange={handleChange} />
                            </div>

                            {errors.slug && ShowAlert("danger", errors.slug.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="categoryId">Category:</label>
                            <div className={styles.sformgroup}>
                                <select {...register("categoryId")} id="categoryId" name="categoryId" className={"form-control categoryId mt-3 " + styles.sformgroupinp} value={formData.categoryId} onChange={handleChange}>
                                    <option disabled>Select the option of category</option>
                                    {!!listCategories && listCategories.map((category: Categories) => (
                                        <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                                    ))}
                                    
                                    {!listCategories && <option value={1}>Geral</option>}
                                </select>
                            </div>

                            {errors.categoryId && ShowAlert("danger", errors.categoryId.message)}
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

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="userId" className="hidden">User Id:</label>
                            <input {...register("userId")} type="number" name="userId" id="userId" className={"form-control userId mt-3 " + styles.sformgroup + " hidden"} value={getUserId() ?? 1} />
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="button" onClick={handleReset}>Reset</button>
                            <button className="btn btn-primary btnedit btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Edit</button>
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

export default EditNewsForm;