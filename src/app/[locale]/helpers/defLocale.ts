import { getFromStorage } from "@applocale/hooks/localstorage";
import { getLangSetting } from "../hooks/settingsvals";

export const getDefLocale = () => {
    return getLangSetting() ?? getFromStorage("language");
}

export const getLinkLocale = () => {
    return "http://localhost:3000/" + getDefLocale();
}