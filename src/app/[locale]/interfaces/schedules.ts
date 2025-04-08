export interface Schedules {
    scheduleId: number;
    title: string;
    dateStart: Date | string;
    dateEnd: Date | string;
    allDay?: boolean;
}