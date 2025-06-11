/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Comments } from "@applocale/interfaces/comments";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import { formatDate } from '@applocale/functions/functions';
import Toasts from "@applocale/components/ui/toasts/toasts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";

const DeleteCommentsForm = ({ commentId, data }: { commentId: number, data: Comments }) => {
    const t = useTranslations("ui.forms.crud.comments.delete");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
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

            return () => {
                connect.stop();
                connect.off("ReceiveMessage");
            };
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
                setDataToast({type: "success", message: t("messages.success") ?? "Comment has been deleted successfully!", statusToast: true});

                setTimeout(async () => {
                    await sendMessage(connection!, r.data);
                    push("/"+locale);
                }, 1000 * 5);
            }).catch((err) => {
                setDataToast({type: "error", message: t("messages.error", {message: ""+err.message}) ?? `Error when deleting comment! Message: ${err.message}`, statusToast: true});
            });
        } catch (error) {
            setDataToast({type: "error", message: t("messages.errorapi", {message: ""+error}) ?? `Occurred an error when trying to delete the comment! Message: ${error}`, statusToast: true});
        }
    };

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/"+locale);
    }

    return (
        <div className="container">
            {dataToast.statusToast && <Toasts id={"toastDeleteCommentsForm"} data={dataToast} modeType={1} />}

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
                    <h3 className="title mx-auto text-center">
                        {t("title") ?? "Delete comment"}
                    </h3>
                    <form className={styles.frmdeletecomments}>
                        <div className={styles.myroundedscrollbar}>
                            <div className="table-responsive mtable-nobordered mtable-shadow">
                                <table className="table table-nobordered table-rounded table-autolayout">
                                    <thead>
                                        <tr>
                                            <th>{t("table.header.id") ?? "Id"}</th>
                                            <th>{t("table.header.content") ?? "Content"}</th>
                                            <th>{t("table.header.status") ?? "Status"}</th>
                                            <th>{t("table.header.userId") ?? "User Id"}</th>
                                            <th>{t("table.header.postId") ?? "Post Id"}</th>
                                            <th>{t("table.header.createdAt") ?? "Created At"}</th>
                                            <th>{t("table.header.updatedAt") ?? "Updated At"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.commentId}</td>
                                            <td>{data.content}</td>
                                            <td>{data.status}</td>
                                            <td>{data.userId}</td>
                                            <td>{data.postId}</td>
                                            <td>{formatDate(data.createdAt!)}</td>
                                            <td>{formatDate(data.updatedAt!)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-center mx-auto mt-3">
                            {t("messages.confirm.title", {id: data.commentId}) ?? `Do you want to delete this comment (id: ${data.commentId})?`}
                        </p>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-primary btndel btn-rounded ms-3" type="button" onClick={handleSubmit}>
                                {t("messages.confirm.btnconfirm") ?? "Delete"}
                            </button>
                            <button className="btn btn-secondary btnback btn-rounded ms-3" type="button" onClick={handleBack}>
                                {t("messages.confirm.btncancel") ?? "Cancel"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default DeleteCommentsForm;