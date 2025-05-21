/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SearchData from "@applocale/components/searchdata";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale } from "next-intl";

export default function ModalSearch({ onClose, statusModal }: any) {
    const [isClosed, setIsClosed] = useState(false);
    const locale = useLocale() ?? getDefLocale();

    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && !!statusModal) {
                setIsClosed(true);
                setTimeout(() => {
                    onClose();
                }, 1000 * 1);
            }
        });
    }, [onClose, statusModal]);

    const handleCloseClick = (e: any) => {
        e.preventDefault();
        setIsClosed(true);

        setTimeout(() => {
            onClose();
        }, 1000 * 1);
    };

    const modalContent = (
        <div className={"modal modalsearch animate__animated " + (statusModal ? (isClosed ? 'animate__fadeOut' : 'animate__fadeIn') + ' show' : 'animate__fadeOut hidden')} id="modalsearch" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-labelledby="modalsearchLbl" aria-hidden={!!statusModal ? "false" : "true"}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalsearchLbl">Search</h5>
                        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
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