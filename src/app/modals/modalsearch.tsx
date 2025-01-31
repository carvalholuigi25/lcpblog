/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SearchData from "@/app/components/searchdata";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function ModalSearch({ onClose, statusModal }: any) {
    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && !!statusModal) {
                onClose();
            }
        });
    }, [onClose, statusModal]);

    const handleCloseClick = (e: any) => {
        e.preventDefault();
        onClose();
    };

    const modalContent = (
        <div className={"modal modalsearch " + (statusModal ? 'fade show' : 'hidden')} id="modalsearch" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-labelledby="modalsearchLbl" aria-hidden={!!statusModal ? "false" : "true"}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalsearchLbl">Search</h5>
                        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <SearchData />
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