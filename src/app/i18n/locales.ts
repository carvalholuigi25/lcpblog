export interface LanguagesLocales {
    id: number;
    name: string;
    value: string;
}

export const localesary: LanguagesLocales[] = [{
    id: 1,
    name: "English (United Kingdom)",
    value: "en",
},
{
    id: 2,
    name: "Portuguese (Portugal)",
    value: "pt",
}];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValuesLocales = (): any => {
    return localesary.map(x => x.value);
}

export const getPathsLocales = (path?: string) => {
    return path ? localesary.filter(x => x.value == path).map(x => x.value) : localesary.map(x => x.value);
}