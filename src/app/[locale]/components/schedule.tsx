/* eslint-disable @typescript-eslint/no-explicit-any */
// import luxon from 'luxon';
import { Settings } from "luxon";
import { useLocale } from "next-intl";
import { Schedules } from "@applocale/interfaces/schedules";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import listPlugin from '@fullcalendar/list';

Settings.defaultZone = "Europe/Lisbon";

// export const myEventsList = {
//     events: [
//         {
//             title: 'Developing...',
//             start: '2025-04-07T15:00:00',
//             end: '2025-04-07T16:00:00'
//         }
//     ]
// };

export default function Schedule({ data } : { data?: Schedules[] }) {
    const locale = useLocale();
    const plugins = [multiMonthPlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

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

    const onDateClick = (info: any) => {
        console.log(info)
    }

    const onEventClick = (info: any) => {
        console.log(info)
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

    const getMyEvents = () => {
        const dataevents: any[] = [];

        data!.map(x => {
            dataevents.push({
                title: x.title,
                start: x.dateStart,
                end: x.dateEnd,
                allDay: x.allDay
            });
        });

        return {events: dataevents};
    };

    const events = getMyEvents();

    return (
        <div className={"myschedule"}>
            <FullCalendar
                dayMaxEventRows={true}
                plugins={plugins}
                headerToolbar={headerToolbar}
                buttonText={buttonText}
                events={events}
                locale={locale}
                weekends={false}
                selectable={true}
                editable={true}
                droppable={true}
                nowIndicator={true}
                eventResizableFromStart={true}
                views={views}
                dayHeaderFormat={dayHeaderFormat}
                slotLabelFormat={slotFormatLabel}
                initialView="timeGridWeek"
                height={'80vh'}
                multiMonthMaxColumns={1}
                longPressDelay={1000}
                eventLongPressDelay={1000}
                selectLongPressDelay={1000}
                dateClick={onDateClick}
                eventClick={onEventClick}
            />
        </div>
    )
}