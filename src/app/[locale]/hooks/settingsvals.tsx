import { Settings } from "../components/ui/settings";
import { getFromStorage, saveToStorage } from "./localstorage";
import {getConfigSync, getConfig} from "@applocale/utils/config";

export const getDefaultSettings = () => {
    return {
        theme: getThemeSetting(),
        language: getLangSetting(),
        isBordered: getIsBorderedSetting(),
        is3DEffectsEnabled: getIs3DEffectsEnabledSetting(),
        isAutoSaveEnabled: getIsAutoSaveEnabledSetting()
    }
}

export const setDefaultSettings = (fields: Settings) => {
    saveToStorage("mysettings", JSON.stringify({
        theme: fields.theme,
        language: fields.language,
        isBordered: fields.isBordered,
        is3DEffectsEnabled: fields.is3DEffectsEnabled,
        isAutoSaveEnabled: fields.isAutoSaveEnabled
    }));
}

export const getThemeSetting = () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).theme : getConfigSync().theme ?? "glassmorphism";
}

export const getLangSetting = () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).language : getConfigSync().language ?? "pt-PT";
}

export const getIsBorderedSetting = () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).isBordered : getConfigSync().isBordered ?? true;
}

export const getIs3DEffectsEnabledSetting = () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).is3DEffectsEnabled : getConfigSync().is3DEffectsEnabled ?? false;
}

export const getIsAutoSaveEnabledSetting = () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).isAutoSaveEnabled : getConfigSync().isAutoSaveEnabled ?? false;
}

export const getThemeSettingAsync = async () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).theme : (await getConfig()).theme ?? "glassmorphism";
}

export const getLangSettingAsync = async () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).language : (await getConfig()).language ?? "pt-PT";
}

export const getIsBorderedSettingAsync = async () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).isBordered : (await getConfig()).isBordered ?? true;
}

export const getIs3DEffectsEnabledSettingAsync = async () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).is3DEffectsEnabled : (await getConfig()).is3DEffectsEnabled ?? false;
}

export const getIsAutoSaveEnabledSettingAsync = async () => {
    return getFromStorage("mysettings") ? JSON.parse(getFromStorage("mysettings")!).isAutoSaveEnabled : (await getConfig()).isAutoSaveEnabled ?? false;
}