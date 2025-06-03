import mylangs from '@assets/locales/langs.json';

export interface LanguagesLocales {
    id: number;
    name: string;
    value: string;
    prefix: string;
}

export const localesary: LanguagesLocales[] = mylangs.languages;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkIfValuesNotExistLocales = (langval: string): any => {
    return localesary.filter(x => x.value.includes(langval)).length == 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValuesLocales = (langval?: string): any => {
    return langval ? localesary.filter(x => x.value == langval).map(x => x.value) : localesary.map(x => x.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPrefixesLocales = (prefval?: string): any => {
    return prefval ? localesary.filter(x => x.prefix == prefval).map(x => x.prefix) : localesary.map(x => x.prefix);
}