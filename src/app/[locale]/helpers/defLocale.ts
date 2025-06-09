import { getFromStorage } from "@applocale/hooks/localstorage";
import * as config from "@applocale/utils/config";

export const getDefLocale = () => {
    return config.getConfigSync().language ?? getFromStorage("language");
}

export const getLinkLocale = () => {
    return "http://localhost:3000/" + getDefLocale();
}