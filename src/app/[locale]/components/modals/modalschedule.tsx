/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { SchedulesEvents } from "@applocale/interfaces/schedules";

export interface ModalScheduleProps {
    data: SchedulesEvents;
    statusModal: boolean;
    onClose: () => void;
}

export default function ModalSchedule({ data, statusModal, onClose }: ModalScheduleProps) {
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
        <div className={"modal modalschedule " + (statusModal ? 'fade show' : 'hidden')} id="modalschedule" data-bs-backdrop="true" data-bs-focus="true" data-bs-keyboard="true" tabIndex={-1} aria-labelledby="modalscheduleLbl" aria-hidden={!!statusModal ? "false" : "true"}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalscheduleLbl">Schedule</h5>
                        <button type="button" className="btn-close" onClick={handleCloseClick} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Id: {data.scheduleId}</p>
                        <p>Title: {data.title}</p>
                        <p>Date start: {""+data.start}</p>
                        <p>Date end: {""+data.end}</p>
                        <p>Is all day?: {""+data.allDay}</p>
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