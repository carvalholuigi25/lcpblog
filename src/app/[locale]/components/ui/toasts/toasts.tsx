/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import Image from 'next/image';
import { ToastsProps } from "@applocale/interfaces/toasts";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getImagePath } from "@applocale/functions/functions";
import { useTranslations } from "next-intl";

export default function Toasts({ id, data, modeType }: ToastsProps) {
    const t = useTranslations("ui.toasts.data");
    const [isClosed, setIsClosed] = useState(data.statusToast ? false : true);
    const status = !!data.statusToast ? "show" : "hidden";
    const mtype = data.type ? `${data.type}` : "";

    const close = useCallback((event: any) => {
        if (event.key === "Escape" && !!data.statusToast) {
            setIsClosed(true);
        }
    }, [data.statusToast]);

    const handleCloseClick = (e: any) => {
        e.preventDefault();

        if (data.statusToast && !isClosed) {
            setIsClosed(true);
        }
    };

    const getAvatar = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].avatar : "/images/avatars/guest.png";
    }

    const getDisplayName = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].displayName : (data.displayName ?? "guest");
    }

    const toastContent = (
        <div aria-live="polite" aria-atomic="true" key={id} id={id} className={`mtoast ${status} fade`} data-bs-delay="1000" data-bs-autohide="true" data-bs-animation="true" data-bs-pause="hover" data-bs-dismiss="toast" onMouseOver={close} onKeyDown={close}>
            <div className="toast-container p-3">
                <div className={`toast ${mtype} ${status}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <div className="d-flex justify-content-start align-items-center">
                            {!!modeType && modeType == 1 ? (
                                <>
                                    <Image src={getImagePath(getAvatar())} className="rounded img-fluid img-author me-2" width={20} height={20} alt={getDisplayName() + "'s avatar"} />
                                    <strong className={getDisplayName().length > 5 ? "longname" : "name"}>{getDisplayName()}</strong>
                                    <small className="text-body-secondary ms-1">
                                        {t("timestatus") ?? `has posted few seconds ago...`}
                                    </small>
                                </>
                            ) : (
                                <strong>LCPBlog</strong>
                            )}
                        </div>

                        <div className="d-flex justify-content-end align-items-center">
                            <button type="button" className="btn btn-tp btnclosetoast p-0" data-bs-dismiss="toast" aria-label={"Closed"} onClick={handleCloseClick}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div className="toast-body">
                        {data.message}
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        toastContent,
        document.getElementById("toast-root")!
    );
}