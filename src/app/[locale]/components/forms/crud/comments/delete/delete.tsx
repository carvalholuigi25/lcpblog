/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Comments } from "@applocale/interfaces/comments";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";

const DeleteCommentsForm = ({ commentId, data }: { commentId: number, data: Comments }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();

    useEffect(() => {
        async function deleteMyRealData() {
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
                console.log("message deleted");
            });

            return () => connect.stop();
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if (!loading) {
            deleteMyRealData();
        }
    }, [logInfo, loading]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/comments/` + commentId,
                method: 'delete',
                data: data
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The current comment (id: " + commentId + ") has been deleted sucessfully!");
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

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/");
    }

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
                    <h3 className="title mx-auto text-center">Delete comments</h3>
                    <form className={styles.frmdeletecomments}>
                        <div className={styles.myroundedscrollbar}>
                            <div className="table-responsive mtable-nobordered mtable-shadow">
                                <table className="table table-nobordered table-rounded table-autolayout">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Content</th>
                                            <th>Status</th>
                                            <th>User Id</th>
                                            <th>Post Id</th>
                                            <th>Category Id</th>
                                            <th>Created At</th>
                                            <th>Updated At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.commentId}</td>
                                            <td>{data.content}</td>
                                            <td>{data.status}</td>
                                            <td>{data.userId}</td>
                                            <td>{data.postId}</td>
                                            <td>{data.categoryId}</td>
                                            <td>{data.createdAt!.toString()}</td>
                                            <td>{data.updatedAt!.toString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-center mx-auto mt-3">Do you want to delete this comment (id: {data.commentId})?</p>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-primary btndel btn-rounded ms-3" type="button" onClick={handleSubmit}>Yes</button>
                            <button className="btn btn-secondary btnback btn-rounded ms-3" type="button" onClick={handleBack}>No</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default DeleteCommentsForm;