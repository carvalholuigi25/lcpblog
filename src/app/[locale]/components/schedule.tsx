// import luxon from 'luxon';
import { Settings } from "luxon";
import { useLocale } from "next-intl";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

Settings.defaultZone = "Europe/Lisbon";

export const myEventsList = {
    events: [
      {
        title: 'Developing...',
        start: '2025-04-07T15:00:00',
        end: '2025-04-07T16:00:00'
      }
    ]
};

export default function Schedule() {
    const locale = useLocale();

    const headerToolbar = {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridYear, dayGridMonth, timeGridWeek, timeGridDay'
    };

    const plugins = [dayGridPlugin, timeGridPlugin];

    return (
        <div className={"myschedule"}>
            <FullCalendar
                plugins={plugins}
                headerToolbar={headerToolbar}
                events={myEventsList}
                locale={locale}
                weekends={false}
                initialView="dayGridMonth"
                height={'80vh'}
            />
        </div>
    )
}