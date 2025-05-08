/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFormComments, useMySchemaComments } from "@applocale/schemas/formSchemas";
import { Comments as CT } from "@applocale/interfaces/comments";
import { User } from "@applocale/interfaces/user";
import { getImagePath } from "@applocale/functions/functions";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import FetchDataAxios, { FetchMultipleDataAxios } from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";
import ShowAlert from "@applocale/components/alerts";
import Toasts from "@applocale/components/toasts/toasts";

export interface CommentsProps {
    content?: string;
    status?: string;
    userId?: number;
    postId?: number;
    categoryId?: number;
    isCommentFormShown?: boolean;
}

export default function Comments({ userId, postId, categoryId, isCommentFormShown }: CommentsProps) {
    const t = useTranslations("ui.forms.comments");
    const locale = useLocale() ?? getDefLocale();

    const [formData, setFormData] = useState({
        content: "",
        status: "0",
        userId: userId ?? 1,
        postId: postId ?? 1,
        categoryId: categoryId ?? 1
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [commentsData, setCommentsData] = useState(new Array<any>());
    const [usersData, setUsersData] = useState(new Array<User>());
    const [isUnlockedComment, setIsUnlockedComment] = useState(false);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
    const is3DThingsEnabled = process.env.NEXT_PUBLIC_is3DThingsEnabled == "true" ? true : false;
    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
        watch,
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
                setIsUnlockedComment(data[0].status == "unlocked" ? true : false);
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
                setDataToast({type: "success", message: t("apimessages.success") ?? "The new comment has been added sucessfully!", statusToast: true});

                setTimeout(() => {
                    push("/"+locale);                    
                }, 1000 * 5);
            }).catch((err) => {
                setDataToast({type: "error", message: t("apimessages.error", {message: ""+err.message}) ?? `Failed to add new comment! Message: ${err.message}`, statusToast: true});
            });
        } catch (error) {
            setDataToast({type: "error", message: t("apimessages.errorapi", {message: ""+error}) ?? `Error when adding new comment! Message: ${error}`, statusToast: true});
        }
    };

    const lockOrUnlockComment = async (e: any, x: CT) => {
        e.preventDefault();
        let status = "0";
        let lockstatus = "unlocked";

        if(x.status == "locked") {
            status = "1";
            lockstatus = "unlocked";
            setIsUnlockedComment(true);
        } else {
            status = "0";
            lockstatus = "locked";
            setIsUnlockedComment(false);
        }

        await updateCommentStatus(postId!, x.commentId, status, lockstatus);
    };

    const updateCommentStatus = async (postId: number, commentId: number, status: string, lockstatus: string) => {
        try {
            console.log(lockstatus);

            await FetchDataAxios({
                url: `api/comments/posts/${commentId}/${postId}?status=${status}`,
                method: 'put',
                reqAuthorize: true,
                data: {
                    postId: postId,
                    commentId: commentId,
                    status: status
                }
            }).then(async (r) => {
                console.log(r);
                const keywordStatus = status == "1" ? t("actions.keywords.unlocked") ?? "unlocked" : t("actions.keywords.locked") ?? "locked";
                setDataToast({type: "success", message: t("apimessages.statussuccess", {keywordStatus}) ?? `The current comment has been ${keywordStatus} sucessfully!`, statusToast: true});

                setTimeout(() => {
                    location.reload();
                }, 1000 * 5);
            }).catch((err) => {
                console.error(err);
                const keywordStatus = status == "1" ? t("actions.keywords.unlock") ?? "unlock" : t("actions.keywords.lock") ?? "lock";
                setDataToast({type: "error", message: t("apimessages.statuserror", {message: ""+err.message, keywordStatus}) ?? `Failed to ${keywordStatus} current comment! Message: ${err.message}`, statusToast: true});
            });
        } catch (error) {
            console.error(error);
            const keywordStatus = status == "1" ? t("actions.keywords.unlock") ?? "unlock" : t("actions.keywords.lock") ?? "lock";
            setDataToast({type: "error", message: t("apimessages.statuserrorapi", {message: ""+error, keywordStatus}) ?? `Failed to ${keywordStatus} current comment! Message: ${error}`, statusToast: true});
        }
    }

    const getEmptyComments = (): any => {
        return (
            <div className='col-12 mb-3' key={"emptycomments"}>
                <div className="card cardnodata p-3 text-center">
                    <div className='card-body'>
                        <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
                        <p>{t("emptycomments") ?? "0 comments"}</p>
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
                        <div className={"d-flex mt-3 mb-3 commentsblk " + (x.status == "locked" ? "commentlocked" : "")} key={x.commentId}>
                            <div className="commentcol1">
                                <Link href={`/pages/users/${y.userId}`} target="_blank">
                                    <Image src={getImagePath(y.avatar!)} className="rounded img-fluid img-author" width={50} height={50} alt={t("inputs.lblphavatar", {displayName: y.displayName!}) ?? y.displayName! + "'s avatar"} />
                                </Link>
                            </div>
                            <div className="commentcol2 ms-3">
                                {["admin", "moderator", "user"].includes(y.role!) && (
                                    <div className="namecomment">
                                        <Link href={`/pages/users/${y.userId}`} target="_blank">
                                            <h5 className="text-start">{y.displayName}</h5>
                                        </Link>

                                        <div className={"dropdown text-start " + (!!isLoggedIn && y.userId == x.userId ? "" : "hidden")}>
                                            {x.status == "locked" && (
                                                <Link className="btn btn-primary btn-rounded btndisabled" href="#" role="button" title={t("status.locked") ?? "This comment is now locked!"} aria-disabled>
                                                    <i className="bi bi-lock ps-0 pe-0"></i>
                                                </Link>
                                            )}

                                            <Link className="btn btn-primary dropdown-toggle btn-rounded btncommentactions ms-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-three-dots"></i>
                                            </Link>

                                            <ul className="dropdown-menu">
                                                <li>
                                                    <Link className="dropdown-item" href={`/pages/comments/edit/${x.commentId}`}>
                                                        <i className="bi bi-pen me-1"></i>
                                                        {t("actions.btnedit") ?? "Edit"}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" href={`/pages/comments/delete/${x.commentId}`}>
                                                        <i className="bi bi-trash me-1"></i>
                                                        {t("actions.btndelete") ?? "Delete"}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className={"dropdown-item " + (isUnlockedComment ? "unlocked" : "locked")} href="#" onClick={(e: any) => lockOrUnlockComment(e, x)}>
                                                        <i className={"bi " + (x.status == "locked" || x.status == "1" ? "bi-unlock" : "bi-lock") + " me-1"}></i>
                                                        {(x.status == "locked" || x.status == "1" ? (t("actions.statusunlock") ?? "Unlock") : (t("actions.statuslock") ?? "Lock"))}
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <p className="contentcomment">{x.content}</p>
                                <p className="timecomment mt-2">
                                    <i className="bi bi-clock"></i>
                                    <span className="time" title={x.createdAt}>
                                        {new Date(x.createdAt!).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                }
            });
        });

        return !!isCommentFormShown && items;
    }

    const getMyFormComments = () => {
        return !!isCommentFormShown && isLoggedIn && (
            <>
                {dataToast.statusToast && <Toasts id={"toastAddNewComments"} data={dataToast} />}
                <div className="frmcommentsblk mt-3 mb-3">
                    <div className="frmcommentscol1">
                        <Image src={getImagePath(JSON.parse(logInfo!)[0].avatar!)} className="rounded img-fluid img-author" width={50} height={50} alt={t("inputs.lblphavatar", {displayName: JSON.parse(logInfo!)[0].displayName!}) ?? JSON.parse(logInfo!)[0].displayName! + "'s avatar"} />
                    </div>
                    <div className="frmcommentscol2 ms-3">
                        <form className={styles.frmaddcomments}>
                            <div className="form-group text-center">
                                <div className={styles.sformgroup + " mycommentinp"}>
                                    <div className="caret"></div>
                                    <textarea {...register("content")} id="content" name="content" className={"form-control content caretcontrol " + styles.sformgroupinp} placeholder={t('inputs.lblphcontent')} value={formData.content} onChange={handleChange} cols={1} rows={5} required />
                                </div>

                                {errors.content && ShowAlert("danger", errors.content.message)}
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="status" className="hidden">
                                    {t('inputs.lblstatus') ?? "Status:"}
                                </label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <select {...register("status")} id="status" name="status" className={"form-control status mt-3 hidden " + styles.sformgroupinp} value={formData.status} onChange={handleChange}>
                                        <option disabled>{t('inputs.selstatus.phopt') ?? "Select the option of status"}</option>
                                        <option value={"0"}>
                                            {t('inputs.selstatus.options.opt1') ?? "All"}
                                        </option>
                                        <option value={"1"}>
                                            {t('inputs.selstatus.options.opt2') ?? "Locked"}
                                        </option>
                                        <option value={"2"}>
                                            {t('inputs.selstatus.options.opt3') ?? "Deleted"}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="userId" className="hidden">
                                    {t('inputs.lbluserid') ?? "User Id:"}
                                </label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <input {...register("userId")} type="hidden" id="userId" name="userId" className={"form-control userId mt-3 " + styles.sformgroupinp} onChange={handleChange} disabled />
                                </div>
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="postId" className="hidden">
                                    {t('inputs.lblpostid') ?? "Post Id:"}
                                </label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <input {...register("postId")} type="hidden" id="postId" name="postId" className={"form-control postId mt-3 " + styles.sformgroupinp} onChange={handleChange} disabled />
                                </div>
                            </div>

                            <div className="form-group mt-3 text-center hidden">
                                <label htmlFor="categoryId" className="hidden">
                                    {t('inputs.lblcategoryid') ?? "Category Id"}
                                </label>
                                <div className={styles.sformgroup + " hidden"}>
                                    <input {...register("categoryId")} type="hidden" id="categoryId" name="categoryId" className={"form-control categoryId mt-3 " + styles.sformgroupinp} onChange={handleChange} disabled />
                                </div>
                            </div>

                            <div className="d-inline-block mx-auto mt-3">
                                <button className={"btn btn-secondary btnreset btn-rounded " + (is3DThingsEnabled ? "btn-3d-box" : "")} type="reset" onClick={handleReset}>
                                    {t("inputs.btnreset") ?? "Reset"}
                                </button>
                                <button className={"btn btn-primary btnadd btn-rounded ms-3 " + (is3DThingsEnabled ? "btn-3d-box" : "")} type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                    {t("inputs.btnadd") ?? "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {getMyComments()}
            {getMyFormComments()}
        </>
    );
}
