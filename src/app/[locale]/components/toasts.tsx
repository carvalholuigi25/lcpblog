"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export interface ToastsProps {
    id: string;
    type?: string;
    content: string;
    statusToast: boolean;
    onClose: () => void;
}

export default function Toasts({ id, type, content, statusToast, onClose }: ToastsProps) {
    useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && !!statusToast) {
                onClose();
            }
        });
    }, [statusToast, onClose]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCloseClick = (e: any) => {
        e.preventDefault();

        if (statusToast) {
            onClose();
        }
    };

    const status = !!statusToast ? "show" : "hidden";
    const mtype = type ? "text-bg-" + type : "";

    const toastContent = (
        <div aria-live="polite" aria-atomic="true" key={id} id={id} className={`mtoast ${status} fade`} data-bs-delay="1000" data-bs-autohide="true" data-bs-animation="true" data-bs-pause="hover" data-bs-dismiss="toast">
            <div className="toast-container p-3">
                <div className={`toast ${mtype} ${status}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">LCPBlog</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={handleCloseClick}></button>
                    </div>
                    <div className="toast-body">
                        {content}
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