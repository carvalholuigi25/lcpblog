/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Settings } from "luxon";
import { useLocale } from "next-intl";
import { Schedules } from "@applocale/interfaces/schedules";
import { CalendarOptions } from "@fullcalendar/core/index.js";
import ModalSchedule from "@applocale/components/modals/modalschedule";
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
    const locale = useLocale();
    const [scheduleId, setScheduleId] = useState(1);
    const [showModal, setShowModal] = useState(false);
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
            alert(info.event.title + " was dropped on " + info.event.start.toISOString());
    
            if (!confirm("Are you sure about this change?")) {
                info.revert();
            }
        }
    }

    const onEventResize = (info: any) => {
        if(!!isEditable) {
            alert(info.event.title + " end is now " + info.event.end.toISOString());

            if (!confirm("Is this okay?")) {
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
            {showModal && <ModalSchedule statusModal={showModal} onClose={closeModal} data={dataModal} />}
            <div className={"myschedule"}>
                <FullCalendar ref={calendarRef} {...calendarOptions} />
            </div>
        </>
    )
}