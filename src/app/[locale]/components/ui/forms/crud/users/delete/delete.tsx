/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { User } from "@applocale/interfaces/user";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import Toasts from "@applocale/components/ui/toasts/toasts";

const DeleteUsersForm = ({ id, data }: { id: number, data: User }) => {
    const t = useTranslations("ui.forms.crud.users.delete");
    
    const locale = useLocale() ?? getDefLocale();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);
    
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
                url: `api/users/${id}`,
                method: 'delete',
                data: data,
                reqAuthorize: true,
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    setDataToast({ type: "success", message: t("messages.success", {id}) ?? `The user (id: ${id}) has been deleted sucessfully!`, statusToast: true });
                    push("/"+locale);
                }, 1000 / 2);
            }).catch((err) => {
                setDataToast({ type: "error", message: t("messages.error", {id: id, message: err.message}) ?? `Failed to delete this user (id: ${id})! Message: ${err.message}`, statusToast: true });
            });
        } catch (error) {
            setDataToast({ type: "error", message: t("messages.errorapi", {id: id, message: ""+error}) ?? `Ocurred an error while trying to delete this user (id: ${id})! Message: ${error}`, statusToast: true });
        }
    };

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/"+locale);
    }

    return (
        <div className="container">
            {dataToast.statusToast && <Toasts id={"toastDeleteUsersForm"} data={dataToast} />}

            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{ marginTop: '3rem' }}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{ fontSize: '4rem' }} />
                                <p className="mt-3">
                                    {t("unauth") ?? "You are not authorized to see this page!"}
                                </p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>
                                    {t("btnback") ?? "Back"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">{t("title") ?? "Delete users"}</h3>
                    <form className={styles.frmdeleteusers}>
                        <div className={styles.myroundedscrollbar}>
                            <div className="table-responsive mtable-nobordered mtable-shadow">
                                <table className="table table-nobordered table-rounded table-autolayout">
                                    <thead>
                                        <tr>
                                            <th>{t("table.header.userId") ?? "User Id"}</th>
                                            <th>{t("table.header.username") ?? "Username"}</th>
                                            <th>{t("table.header.email") ?? "Email"}</th>
                                            <th>{t("table.header.displayName") ?? "Display Name"}</th>
                                            <th>{t("table.header.role") ?? "Role"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{data.userId}</td>
                                            <td>{data.username}</td>
                                            <td>{data.email}</td>
                                            <td>{data.displayName}</td>
                                            <td>{data.role}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <p className="text-center mx-auto mt-3">
                            {t("messages.confirm.title", {id: data.userId}) ?? `Do you want to delete this user (id: ${data.userId})?`}
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

export default DeleteUsersForm;