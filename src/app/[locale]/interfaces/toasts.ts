export interface ToastsProps {
    id?: string;
    data: DataToastsProps;
    modeType?: number;
}

export interface DataToastsProps {
    type?: string;
    message?: string;
    statusToast?: boolean;
    displayName?: string;
}