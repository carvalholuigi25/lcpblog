export interface ToastsProps {
    id?: string;
    data: DataToastsProps;
}

export interface DataToastsProps {
    type?: string;
    message?: string;
    statusToast?: boolean;
    displayName?: string;
}