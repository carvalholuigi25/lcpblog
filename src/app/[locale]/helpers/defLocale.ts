import { getFromStorage } from "@applocale/hooks/localstorage";
import { getLangSetting } from "../hooks/settingsvals";
import { getConfigSync } from "../utils/config";

export const getDefLocale = () => {
    return getConfigSync().language ?? getLangSetting() ?? getFromStorage("language");
}

export const getLinkLocale = () => {
    return "http://localhost:3000/" + getDefLocale();
}