/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Settings } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { Schedules } from "@applocale/interfaces/schedules";
import { CalendarOptions } from "@fullcalendar/core/index.js";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import ModalSchedule from "@applocale/components/ui/modals/modalschedule";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import listPlugin from '@fullcalendar/list';

export function getMyCurTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Europe/Lisbon";
}

Settings.defaultZone = getMyCurTimeZone();

export default function Schedule({ data }: { data?: Schedules[] }) {
    const t = useTranslations("ui.events.messages");
    const locale = useLocale();
    const [scheduleId, setScheduleId] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [dataToast, setDataToast] = useState({ type: "", message: "", statusToast: false } as DataToastsProps);

    const isEditable: boolean = false;

    const headerToolbar = {
        left: 'prev, next today',
        center: 'title',
        right: 'multiMonthYear, dayGridMonth, timeGridWeek, timeGridDay, listWeek'
    }

    const buttonText = {
        today: 'Hoje',
        year: 'Ano',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista'
    }

    const views = {
        timeGrid: {
            dayMaxEventRows: 6
        }
    }

    const dayHeaderFormat: any = {
        weekday: 'short'
    }

    const slotFormatLabel: any = {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const onDateClick = (info: any) => {
        console.log(info);
    }

    const onEventClick = (info: any) => {
        const eventid = info.event.extendedProps.scheduleId;
        console.log(info);
        setScheduleId(eventid);
        setShowModal(true);
    }

    const onEventDrop = (info: any) => {
        if(!!isEditable) {
            const title = info.event.title;
            const dateStart = info.event.start.toISOString();
            setDataToast({type: "success", message: t("dropevent", {title, dateStart}) ?? `${title} was dropped on ${dateStart}`, statusToast: true});
    
            if (!confirm(t("lblwarndrop") ?? "Are you sure about this change?")) {
                info.revert();
            }
        }
    }

    const onEventResize = (info: any) => {
        if(!!isEditable) {
            const title = info.event.title;
            const dateEnd = info.event.end.toISOString();
            setDataToast({type: "success", message: t("resizeevent", {title, dateEnd}) ?? `${title} end is now on ${dateEnd}`, statusToast: true});

            if (!confirm(t("lblwarnres") ?? "Is this okay?")) {
                info.revert();
            }
        }
    }

    const getMyEvents = () => {
        const dataevents: any[] = [];

        if (!!data && data?.length > 0) {
            data!.map(x => {
                dataevents.push({
                    scheduleId: x.scheduleId,
                    title: x.title,
                    start: x.dateStart,
                    end: x.dateEnd,
                    allDay: x.allDay
                });
            });
        }

        return { events: dataevents };
    };

    const calendarRef = useRef(null);
    const events = getMyEvents();
    const dataModal = events.events[scheduleId-1];

    const plugins = [multiMonthPlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

    const calendarOptions: CalendarOptions = {
        timeZone: getMyCurTimeZone(),
        plugins: plugins,
        headerToolbar: headerToolbar,
        buttonText: buttonText,
        dayHeaderFormat: dayHeaderFormat,
        slotLabelFormat: slotFormatLabel,
        events: events,
        locale: locale,
        views: views,
        weekends: false,
        allDayText: 'Todo-dia',
        selectable: true,
        editable: isEditable,
        droppable: isEditable,
        nowIndicator: true,
        dayMaxEventRows: true,
        eventResizableFromStart: true,
        initialView: "timeGridWeek",
        height: "80vh",
        firstDay: 1,
        multiMonthMaxColumns: 1,
        longPressDelay: 1000,
        eventLongPressDelay: 1000,
        selectLongPressDelay: 1000,
        dateClick: onDateClick,
        eventClick: onEventClick,
        eventDrop: onEventDrop,
        eventReceive: onEventDrop,
        eventResize: onEventResize
    }

    return (
        <>
            {dataToast.statusToast && <Toasts id={"toastSchedule"} data={dataToast} modeType={1} />}
            {showModal && <ModalSchedule statusModal={showModal} onClose={closeModal} data={dataModal} />}
            <div className={"myschedule"}>
                <FullCalendar ref={calendarRef} {...calendarOptions} />
            </div>
        </>
    )
}