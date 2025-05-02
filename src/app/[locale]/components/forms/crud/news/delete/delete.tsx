/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Posts } from "@applocale/interfaces/posts";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import { useLocale, useTranslations } from "next-intl";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";
import Toasts from "@applocale/components/toasts/toasts";

const DeleteNewsForm = ({ id, data }: { id: number, data: Posts }) => {
    const t = useTranslations("ui.forms.crud.news.delete");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [loading, setLoading] = useState(true);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
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
                url: `api/posts/` + id,
                method: 'delete',
                data: data
            }).then(async (r) => {
                console.log(r);
                setDataToast({type: "success", message: t("messages.success") ?? "The news post has been deleted successfully!", statusToast: true});

                setTimeout(async () => {
                    await sendMessage(connection!, r.data);
                    push("/"+locale);
                }, 1000 * 5);
            }).catch((err) => {
                setDataToast({type: "error", message: t("messages.error", {message: ""+err}) ?? `Failed to delete this news post! Message: ${err}`, statusToast: true});
            });
        } catch (error) {
            setDataToast({type: "error", message: t("messages.errorapi", {message: ""+error}) ?? `Ocurred an error while deleting this news post! Message: ${error}`, statusToast: true});
        }
    }

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/"+locale);
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
                    {dataToast.statusToast && <Toasts id={"toastDelNews"} data={dataToast} />}

                    <h3 className="title mx-auto text-center">
                        {t("title") ?? "Delete news"}
                    </h3>
                    <form className={styles.frmdeletenews}>
                        <div className={styles.myroundedscrollbar}>
                            <div className="table-responsive mtable-nobordered mtable-shadow">
                                <table className="table table-nobordered table-rounded table-autolayout">
                                    <thead>
                                        <tr>
                                            <th>{t("table.header.id") ?? "Id"}</th>
                                            <th>{t("table.header.title") ?? "Title"}</th>
                                            <th>{t("table.header.categoryId") ?? "Category Id"}</th>
                                            <th>{t("table.header.userId") ?? "User Id"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.postId}</td>
                                            <td>{data.title}</td>
                                            <td>{data.categoryId}</td>
                                            <td>{data.userId}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-center mx-auto mt-3">
                            {t("messages.confirm.title", {id: data.postId}) ?? "Are you sure you want to delete this news post (id: {id})?"}
                        </p>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-primary btndel btn-rounded ms-3" type="button" onClick={handleSubmit}>
                                {t("messages.confirm.btnconfirm") ?? "Yes"}
                            </button>
                            <button className="btn btn-secondary btnback btn-rounded ms-3" type="button" onClick={handleBack}>
                                {t("messages.confirm.btncancel") ?? "No"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default DeleteNewsForm;