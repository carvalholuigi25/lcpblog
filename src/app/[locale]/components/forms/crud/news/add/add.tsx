/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { TFormNews, fnewsSchema } from "@applocale/schemas/formSchemas";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EditorState } from "lexical";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import ShowAlert from "@applocale/components/alerts";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import {Link} from '@/app/i18n/navigation';
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import MyEditorPost from "@applocale/components/editor/myeditorpost";
import * as signalR from "@microsoft/signalr";
import { Categories } from "@applocale/interfaces/categories";

const AddNewsForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "blog.jpg",
        slug: "/news/1",
        status: "0",
        categoryId: 1,
        userId: 1,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [editorState, setEditorState] = useState("");
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [listCategories, setListCategories] = useState([]);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<TFormNews>({
        resolver: zodResolver(fnewsSchema),
    });

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
                title: "",
                content: "",
                image: "blog.jpg",
                slug: "/news/1",
                status: "0",
                categoryId: 1,
                userId: getUserId() ?? 1,
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if(!loading) {
            addMyRealData();
        }
    }, [isResetedForm, logInfo, loading]);

    if (loading) {
        return (
            <div className='container'>
                <div className='row justify-content-center align-items-center p-3'>
                    <div className='col-12 card p-3 text-center'>
                        <div className='card-body'>
                            <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getUserId = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : null;
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setIsResetedForm(true);
    };

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

                setTimeout(async () => {
                    alert("The news post has been added sucessfully!");
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
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Add news</h3>
                    <form className={styles.frmaddnews}>
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
                                <MyEditorPost {...register("content")} value={formData.content ?? editorState} editable={true} onChange={onChangeEditor} />
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
                                    className="mt-3"
                                >
                                    <Image 
                                        src={"/images/" + (formData.image ?? "blog.jpg")} 
                                        width="600" 
                                        height="300" 
                                        alt="Image" 
                                        className={styles.inpimgprev} 
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
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                            <button className="btn btn-primary btnadd btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Add</button>
                        </div>
                    </form>
                    
                    <div className="col-12">
                        <div className="mt-3 mx-auto text-center">
                            <Link href={'/'} className="btn btn-primary btn-rounded">Back</Link>
                        </div>
                    </div>
                </>
            )}  
        </div>
    );
}

export default AddNewsForm;