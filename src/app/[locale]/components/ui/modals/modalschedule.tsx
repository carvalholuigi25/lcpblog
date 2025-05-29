/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { SchedulesEvents } from "@applocale/interfaces/schedules";
import { useTranslations } from "use-intl";

export interface ModalScheduleProps {
    data: SchedulesEvents;
    statusModal: boolean;
    onClose: () => void;
}

export default function ModalSchedule({ data, statusModal, onClose }: ModalScheduleProps) {
    const t = useTranslations("ui.modals.schedule");
    const modalScheduleRef = useRef<any>(null);
    const [isClosed, setIsClosed] = useState(false);

    const close = useCallback((event: any) => {
        event.preventDefault();
        
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (modalScheduleRef.current) {
            // Focus the modal when it opens
            modalScheduleRef.current.focus();
        }
    }, []);

    const handleCloseClick = (e: any) => {
        e.preventDefault();
        setIsClosed(true);

        setTimeout(() => {
            onClose();        
        }, 500);
    };

    const scheduleCl = `modal modalschedule animate__animated ${(statusModal ? (isClosed ? 'animate__fadeOut' : 'animate__fadeIn') + ' show' : 'animate__fadeOut hidden')}`;

    const modalContent = (
        <div ref={modalScheduleRef} className={scheduleCl} id="modalschedule" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-labelledby="modalscheduleLbl" aria-hidden="false" role="dialog" onMouseOver={close} onKeyDown={close}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalscheduleLbl">{t("title") ?? "Schedule"}</h5>
                        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{t("lblschid", {id: data.scheduleId}) ?? `Id: ${data.scheduleId}`}</p>
                        <p>{t("lblschtitle", {title: data.title}) ?? `Title: ${data.title}`}</p>
                        <p>{t("lblschdatestart", {date: ""+data.start}) ?? `Date start: ${""+data.start}`}</p>
                        <p>{t("lblschdateend", {date: ""+data.end}) ?? `Date end: ${""+data.end}`}</p>
                        <p>{t("lblschallday", {allday: ""+data.allDay}) ?? `Is all day?: ${""+data.allDay}`}</p>
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