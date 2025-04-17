/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFormComments, useMySchemaComments } from "@applocale/schemas/formSchemas";
import { Comments as CT } from "@applocale/interfaces/comments";
import { User } from "@applocale/interfaces/user";
import { getImagePath } from "@applocale/functions/functions";
import FetchDataAxios, { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";
import ShowAlert from "@applocale/components/alerts";

export interface CommentsProps {
    content?: string;
    status?: string;
    userId?: number;
    postId?: number;
    categoryId?: number;
    isCommentFormShown?: boolean;
}

export default function Comments({ userId, postId, categoryId, isCommentFormShown }: CommentsProps) {
    const t = useTranslations("ui.forms.comments.validation.errors");
    const [formData, setFormData] = useState({
        content: "",
        status: "0",
        userId: userId ?? 1,
        postId: postId ?? 1,
        categoryId: categoryId ?? 1
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [commentsData, setCommentsData] = useState(new Array<any>());
    const [usersData, setUsersData] = useState(new Array<User>());
    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
        watch
    } = useForm<TFormComments>({
        resolver: zodResolver(useMySchemaComments()),
    });

    watch();

    useEffect(() => {
        async function getComments() {
            const data = await FetchMultipleDataAxios([
                {
                    url: `api/comments/posts/${postId}`,
                    method: 'get',
                    reqAuthorize: false
                },
                {
                    url: `api/users`,
                    method: 'get',
                    reqAuthorize: false
                }
            ]);

            if (data[0]) {
                setCommentsData(JSON.parse(JSON.stringify(data[0])));
            }

            if (data[1]) {
                setUsersData(JSON.parse(JSON.stringify(data[1].data)));
            }

            setLoading(false);
        }

        getComments();

        if (!!isResetedForm) {
            setFormData({
                content: "",
                status: "0",
                userId: userId ?? 1,
                postId: postId ?? 1,
                categoryId: categoryId ?? 1
            });
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }
    }, [isResetedForm, logInfo, loading, categoryId, postId, userId]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

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
                url: `api/comments`,
                method: 'post',
                data: formData,
                reqAuthorize: false
            }).then(async (r) => {
                console.log(r);
                alert("The new comment has been added sucessfully!");
                push("/");
            }).catch((err) => {
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getEmptyComments = (): any => {
        return (
            <div className='col-12 mb-3' key={"emptycomments"}>
                <div className="card p-3 text-center">
                    <div className='card-body'>
                        <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
                        <p>0 comments</p>
                    </div>
                </div>
            </div>
        );
    };

    const getMyComments = () => {
        const items: any[] = [];

        if (!commentsData || commentsData.length == 0) {
            items.push(getEmptyComments())
        }

        commentsData.map((x: CT) => {
            usersData.map((y: User) => {
                if (y.userId == x.userId) {
                    items.push(
                        <div className="d-flex mt-3 mb-3" key={x.commentId}>
                            <div className="flex-shrink-0">
                                <Image src={getImagePath(JSON.parse(logInfo!)[0].avatar!)} className="rounded img-fluid img-author" width={50} height={50} alt={JSON.parse(logInfo!)[0].displayName! + "'s avatar"} />
                            </div>
                            <div className="flex-grow-1 ms-3 justify-content-start align-items-start">
                                <h5>{y.displayName}</h5>
                                <p>{x.content}</p>
                            </div>
                        </div>
                    );
                }
            });
        });

        return items;
    }

    const getMyFormComments = () => {
        return isLoggedIn && !!isCommentFormShown && (
            <>
                {getMyComments()}
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <Image src={getImagePath(JSON.parse(logInfo!)[0].avatar!)} className="rounded img-fluid img-author" width={50} height={50} alt={JSON.parse(logInfo!)[0].displayName! + "'s avatar"} />
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <form className={styles.frmaddcomments}>
                            <div className="form-group text-center">
                                <div className={styles.sformgroup}>
                                    <textarea {...register("content")} id="content" name="content" className={"form-control content " + styles.sformgroupinp} placeholder={t('lblphcontent')} value={formData.content} onChange={handleChange} required />
                                </div>

                                {errors.content && ShowAlert("danger", errors.content.message)}
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="status" className="hidden">Status:</label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <select {...register("status")} id="status" name="status" className={"form-control status mt-3 hidden " + styles.sformgroupinp} value={formData.status} onChange={handleChange}>
                                        <option disabled>Select the option of status</option>
                                        <option value={"0"}>All</option>
                                        <option value={"1"}>Locked</option>
                                        <option value={"2"}>Deleted</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="userId" className="hidden">User Id:</label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <input {...register("userId")} type="hidden" id="userId" name="userId" className={"form-control userId mt-3 " + styles.sformgroupinp} onChange={handleChange} disabled />
                                </div>
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="postId" className="hidden">Post Id:</label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <input {...register("postId")} type="hidden" id="postId" name="postId" className={"form-control postId mt-3 " + styles.sformgroupinp} onChange={handleChange} disabled />
                                </div>
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="categoryId" className="hidden">Category Id:</label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <input {...register("categoryId")} type="hidden" id="categoryId" name="categoryId" className={"form-control categoryId mt-3 " + styles.sformgroupinp} onChange={handleChange} disabled />
                                </div>
                            </div>

                            <div className="d-inline-block mx-auto mt-3">
                                <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                                <button className="btn btn-primary btnadd btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {getMyFormComments()}
        </>
    );
}
