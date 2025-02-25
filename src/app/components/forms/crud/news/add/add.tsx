/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@/app/hooks/localstorage";
import { TFormNews, fnewsSchema } from "@/app/schemas/formSchemas";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EditorState } from "lexical";
import ShowAlert from "@/app/components/alerts";
import styles from "@/app/page.module.scss";
import Image from "next/image";
import Link from "next/link";
import FetchDataAxios from "@/app/utils/fetchdataaxios";
import MyEditorPost from "@/app/components/editor/myeditorpost";
import * as signalR from "@microsoft/signalr";

const AddNewsForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "blog.jpg",
        slug: "/news/1",
        status: "0",
        userId: 1,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [editorState, setEditorState] = useState("");
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<TFormNews>({
        resolver: zodResolver(fnewsSchema),
    });

    useEffect(() => {
        async function loadMyRealData() {
            const connect = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.apiURL}/datahub`, {
                    skipNegotiation: false,
                    transport: signalR.HttpTransportType.None,
                    withCredentials: false,
                    accessTokenFactory: async () => { return "" }
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            setConnection(connect);
        
            try {
                await connect.start();
                console.log("Connection started");
            } catch (e) {
                console.log(e);
            }
        
            connect.on("ReceiveMessage", () => {
                console.log("message received");
            });
        
            return () => connect.stop();
        }

        if(!!isResetedForm) {
            setFormData({
                title: "",
                content: "",
                image: "blog.jpg",
                slug: "/news/1",
                status: "0",
                userId: getUserId() ?? 1,
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
        }

        loadMyRealData();
    }, [isResetedForm, logInfo]);

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
                
                if(connection) {
                    await connection.send("SendMessage", r.data);
                }

                setTimeout(() => {
                    alert("The news post has been added sucessfully!");
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
                                
                                {/* <textarea {...register("content")} id="content" name="content" className={"form-control content mt-3 " + styles.sformgroupinp} placeholder="Write any content here..." value={formData.content} onChange={handleChange} rows={10} cols={1} /> */}
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