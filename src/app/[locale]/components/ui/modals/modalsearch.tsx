/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import SearchData from "@applocale/components/ui/searchdata";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale, useTranslations } from "next-intl";

export default function ModalSearch({ onClose, statusModal }: any) {
    const t = useTranslations("ui.modals.search");
    
    const modalSearchRef = useRef<any>(null);
    const [isClosed, setIsClosed] = useState(false);
    const locale = useLocale() ?? getDefLocale();

    const close = useCallback((event: any) => {
        event.preventDefault();
        
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (modalSearchRef.current) {
            // Focus the modal when it opens
            modalSearchRef.current.focus();
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

    const searchCl = `modal modalsearch animate__animated ${(statusModal ? (isClosed ? 'animate__fadeOut' : 'animate__fadeIn') + ' animate__faster show' : 'animate__fadeOut hidden')}`;

    const modalContent = (
        <div ref={modalSearchRef} className={searchCl} id="modalsearch" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-labelledby="modalsearchLbl" aria-hidden="false" role="dialog" onMouseOver={close} onKeyDown={close}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <h5 className="modal-title" id="modalsearchLbl">{t("title") ?? "Search"}</h5>
                        <button type="button" className="btn btn-tp btnborderless btnclose" onClick={handleCloseClick} aria-label="Close">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        <SearchData locale={locale} />
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