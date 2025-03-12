import { getFromStorage } from "../hooks/localstorage";

export const getDefLocale = () => {
    return getFromStorage("language") ?? 'en-UK';
}

export const getLinkLocale = () => {
    return "http://localhost:3000/" + getDefLocale();
}