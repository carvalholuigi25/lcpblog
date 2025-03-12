export const getDefLocale = () => {
    return localStorage.getItem("language") ?? "en-UK";
}