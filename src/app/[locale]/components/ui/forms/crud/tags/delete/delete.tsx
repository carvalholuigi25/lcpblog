/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from '@/app/i18n/navigation';
import { Tags } from "@applocale/interfaces/tags";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import Toasts from "@applocale/components/ui/toasts/toasts";
import { formatDate } from "@/app/[locale]/functions/functions";

const DeleteTagsForm = ({ id, data }: { id: number, data: Tags }) => {
    const t = useTranslations("ui.forms.crud.tags.delete");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();

    useEffect(() => {
        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
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
                url: `api/tags/` + id,
                method: 'delete',
                data: data
            }).then(async (r) => {
                console.log(r);
                setDataToast({type: "success", message: t("messages.success") ?? "Tag has been deleted successfully!", statusToast: true});

                setTimeout(async () => {
                    push("/"+locale);
                }, 1000 / 2);
            }).catch((err) => {
                setDataToast({type: "error", message: t("messages.error", {message: ""+err.message}) ?? `Error when deleting tag! Message: ${err.message}`, statusToast: true});
            });
        } catch (error) {
            setDataToast({type: "error", message: t("messages.errorapi", {message: ""+error}) ?? `Occurred an error when trying to delete the tag! Message: ${error}`, statusToast: true});
        }
    };

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/"+locale);
    }

    return (
        <div className="container">
            {dataToast.statusToast && <Toasts id={"toastDeleteTagsForm"} data={dataToast} modeType={1} />}

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
                    <h3 className="title mx-auto text-center">{t("title") ?? "Delete tag"}</h3>
                    <form className={styles.frmdeletetags}>
                        <div className={styles.myroundedscrollbar}>
                            <div className="table-responsive mtable-nobordered mtable-shadow">
                                <table className="table table-nobordered table-rounded table-autolayout">
                                    <thead>
                                        <tr>
                                            <th>{t('table.header.tagId') ?? "Id"}</th>
                                            <th>{t('table.header.name') ?? "Name"}</th>
                                            <th>{t('table.header.createdAt') ?? "Created At"}</th>
                                            <th>{t('table.header.updatedAt') ?? "Updated At"}</th>
                                            <th>{t('table.header.status') ?? "Status"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.tagId}</td>
                                            <td>{data.name}</td>
                                            <td>{formatDate(data.createdAt!.toString())}</td>
                                            <td>{formatDate(data.updatedAt!.toString())}</td>
                                            <td>{data.status}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-center mx-auto mt-3">
                            {t('messages.confirm.title') ?? "Are you sure you want to delete this tag?"}
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

export default DeleteTagsForm;