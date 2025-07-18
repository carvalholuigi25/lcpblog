/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Categories } from "@applocale/interfaces/categories";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import { buildMyConnection, formatDate, sendMessage } from "@applocale/functions/functions";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import Toasts from "@applocale/components/ui/toasts/toasts";

const DeleteCategoriesForm = ({ id, data }: { id: number, data: Categories }) => {
    const t = useTranslations("ui.forms.crud.categories.delete");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
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
                url: `api/categories/` + id,
                method: 'delete',
                data: data
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    setDataToast({type: "success", message: t("messages.success") ?? "Category has been deleted successfully!", statusToast: true});

                    await sendMessage(connection!, r.data);
                    push("/"+locale);
                }, 1000 / 2);
            }).catch((err) => {
                setDataToast({type: "error", message: t("messages.error", {message: ""+err.message}) ?? `Error when deleting category! Message: ${err.message}`, statusToast: true});
            });
        } catch (error) {
            setDataToast({type: "error", message: t("messages.errorapi", {message: ""+error}) ?? `Occurred an error when trying to delete the category! Message: ${error}`, statusToast: true});
        }
    };

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/"+locale);
    }

    return (
        <div className="container">
            {dataToast.statusToast && <Toasts id={"toastDeleteCategoriesForm"} data={dataToast} modeType={1} />}

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
                                    {tbtn('btnback') ?? "Back"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">{t("title") ?? "Delete category"}</h3>
                    <form className={styles.frmdeletecategories}>
                        <div className={styles.myroundedscrollbar}>
                            <div className="table-responsive mtable-nobordered mtable-shadow">
                                <table className="table table-nobordered table-rounded table-autolayout">
                                    <thead>
                                        <tr>
                                            <th>{t('table.header.id') ?? "Id"}</th>
                                            <th>{t('table.header.name') ?? "Name"}</th>
                                            <th>{t('table.header.slug') ?? "Slug"}</th>
                                            <th>{t('table.header.createdAt') ?? "Created At"}</th>
                                            <th>{t('table.header.updatedAt') ?? "Updated At"}</th>
                                            <th>{t('table.header.status') ?? "Status"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.categoryId}</td>
                                            <td>{data.name}</td>
                                            <td>{data.slug}</td>
                                            <td>{formatDate(data.createdAt!.toString())}</td>
                                            <td>{formatDate(data.updatedAt!.toString())}</td>
                                            <td>{data.status}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-center mx-auto mt-3">
                            {t('messages.confirm.title') ?? "Are you sure you want to delete this category?"}
                        </p>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-primary btndel btn-rounded ms-3" type="button" onClick={handleSubmit}>
                                {t('messages.confirm.btnconfirm') ?? "Yes"}
                            </button>
                            <button className="btn btn-secondary btnback btn-rounded ms-3" type="button" onClick={handleBack}>
                                {t('messages.confirm.btncancel') ?? "No"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default DeleteCategoriesForm;