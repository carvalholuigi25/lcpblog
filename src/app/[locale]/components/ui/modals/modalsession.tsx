/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslations } from "next-intl";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { LoginStatus, UserSessionsTypes, UserSessionsTypesTimes } from "@applocale/interfaces/user";
import CountdownSession from "@applocale/components/ui/countdowns/countdownsession";

export default function ModalSession({ onClose, statusModal }: any) {
    const t = useTranslations("ui.modals.session");
    
    const modalSessionRef = useRef<any>(null);
    const [isClosed, setIsClosed] = useState(false);
    const [dateSession, setDateSession] = useState(new Date().toISOString());

    const close = useCallback((event: any) => {
        event.preventDefault();
        
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if(getFromStorage("loginStatus")) {
            setDateSession(JSON.parse(getFromStorage("loginStatus")!).valueTimer);
        }
        
        if (modalSessionRef.current) {
            // Focus the modal when it opens
            modalSessionRef.current.focus();
        }

        return () => {}
    }, []);

    const handleCloseClick = (e: any) => {
        e.preventDefault();
        setIsClosed(true);
        
        setTimeout(() => {
            onClose();
        }, 100);
    };

    const sessionCl = `modal modalSession animate__animated ${(statusModal ? (isClosed ? 'animate__fadeOut' : 'animate__fadeIn') + ' animate__faster show' : 'animate__fadeOut hidden')}`;

    const onFinish = async () => {
        if(getFromStorage("loginStatus")) {
            const loginStatus = JSON.parse(getFromStorage("loginStatus")!);
            if(loginStatus.status == "locked" && new Date().getHours() <= new Date("" + loginStatus.dateLock).getHours()) {
                const nloginStatus: LoginStatus = {
                    attempts: 0,
                    status: "unlocked",
                    dateLock: "",
                    dateLockTimestamp: 0,
                    type: loginStatus.type ?? UserSessionsTypes.Permanent,
                    modeTimer: loginStatus.modeTimer ?? UserSessionsTypesTimes.Week,
                    valueTimer: loginStatus.valueTimer ?? "",
                    userId: 1
                };

                saveToStorage("loginStatus", JSON.stringify(nloginStatus));
            }
        }
    }

    const modalContent = (
        <div ref={modalSessionRef} className={sessionCl} id="ModalSession" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-labelledby="modalsessionLbl" aria-hidden="false" role="dialog" onMouseOver={close} onKeyDown={close}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <h5 className="modal-title" id="modalsessionLbl">{t("title") ?? "session"}</h5>
                        <button type="button" className="btn btn-tp btnborderless btnclose" onClick={handleCloseClick} aria-label="Close">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <CountdownSession dateSession={dateSession} onFinish={onFinish} />
                    </div>
                    <div className="modal-footer hidden"></div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root")!
    );
}