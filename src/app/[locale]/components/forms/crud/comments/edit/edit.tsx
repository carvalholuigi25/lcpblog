/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import { useMySchemaComments, type TFormComments } from "@applocale/schemas/formSchemas";
import { Link } from '@/app/i18n/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useRouter } from "next/navigation";
import { Comments } from "@applocale/interfaces/comments";
import { getDefLocale } from "@applocale/helpers/defLocale";
import ShowAlert from "@applocale/components/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";

const EditCommentsForm = ({ commentid, data }: { commentid: number, data: Comments }) => {
    const [formData, setFormData] = useState({
        content: data.content ?? ""
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm<TFormComments>({
        resolver: zodResolver(useMySchemaComments()),
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

        if (!!isResetedForm) {
            setFormData({
                content: data.content ?? ""
            });
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if(!loading) {
            updateMyRealData();
        }
    }, [isResetedForm, logInfo, data, loading, setValue]);

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
                url: `api/comments/` + commentid,
                method: 'put',
                data: {
                    commentid: commentid,
                    content: formData.content,
                    status: data.status ?? "0",
                    userId: data.userId ?? 1,
                    postId: data.postId ?? 1,
                    categoryId: data.categoryId ?? 1
                }
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The current comment has been updated sucessfully!");
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

    return (
        <div className="container">
            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{ marginTop: '3rem' }}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{ fontSize: '4rem' }} />
                                <p className="mt-3">You are not authorized to see this page!</p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Edit comments</h3>
                    <form className={styles.frmeditcomments}>
                        <div className="form-group mt-3 text-center">
                            <label htmlFor="content">Content</label>
                            <div className={styles.sformgroup}>
                                <textarea {...register("content")} id="content" name="content" className={"form-control content mt-3 " + styles.sformgroupinp} placeholder="Write your content of comment here..." value={formData.content} cols={1} rows={10} onChange={handleChange} required />
                            </div>

                            {errors.content && ShowAlert("danger", errors.content.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
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

export default EditCommentsForm;