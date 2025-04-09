export interface Schedules {
    scheduleId: number;
    title: string;
    dateStart: Date | string;
    dateEnd: Date | string;
    allDay?: boolean;
}

export interface SchedulesEvents {
    scheduleId: number;
    title: string;
    start: Date | string;
    end: Date | string;
    allDay?: boolean;
}

export interface SchedulesData {
    events: Schedules[];
}