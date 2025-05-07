export interface LanguagesLocales {
    id: number;
    name: string;
    value: string;
    prefix: string;
}

export const localesary: LanguagesLocales[] = [{
    id: 1,
    name: "English (United Kingdom)",
    value: "en-UK",
    prefix: "gb"
},
{
    id: 2,
    name: "Português (Portugal)",
    value: "pt-PT",
    prefix: "pt"
},
{
    id: 3,
    name: "English (United States)",
    value: "en-US",
    prefix: "us"
}];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValuesLocales = (langval?: string): any => {
    return langval ? localesary.filter(x => x.value == langval).map(x => x.value) : localesary.map(x => x.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPrefixesLocales = (prefval?: string): any => {
    return prefval ? localesary.filter(x => x.prefix == prefval).map(x => x.prefix) : localesary.map(x => x.prefix);
}