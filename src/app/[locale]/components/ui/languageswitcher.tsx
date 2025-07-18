/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LanguagesLocales, localesary } from "@/app/i18n/locales";
import { useLanguage } from "@applocale/components/ui/context/languagecontext";
import { redirect } from "next/navigation";
import { setCookie } from 'cookies-next';
import { getConfigSync } from "../../utils/config";

export function getMyCustomLanguages() {
    const ary = localesary.sort((x, y) => x.value.toLowerCase().localeCompare(y.value.toLowerCase()));

    return [...new Map(ary.map(item => [item.id, item])).values()];
}

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const languagesary: LanguagesLocales[] = getMyCustomLanguages();
    const is3DEffectsEnabled = getConfigSync().is3DEffectsEnabled;

    const setMyLanguage = async (e: any, x: LanguagesLocales): Promise<any> => {
        e.preventDefault();
        setLanguage(x.value);
        setCookie('NEXT_LOCALE', x.value);
        redirect(!x.value.includes('/') ? '/' + x.value : x.value);
    }

    const activeLanguage = (x: string) => {
        return x == language ? " active" : "";
    }

    const getLanguageFlag = (newPrefixVal: string = "") => {
        const langp = !!newPrefixVal ? newPrefixVal : (!!languagesary ? languagesary.filter(x => x.value == language).map(x => x.prefix) : "gb");

        return (
            <span className={`fi fi-${langp} langflag`}></span>
        )
    }

    const getLanguageName = () => {
        return !!languagesary ? languagesary.filter(x => x.value == language).map(x => x.name) : "English (United Kingdom)";
    }

    return (
        <>
            {!!languagesary && (
                <div className="dropdown mt-3 mb-3">
                    <button
                        className={"btn btn-secondary dropdown-toggle btn-rounded " + (is3DEffectsEnabled ? "btn3Dbox" : "")}
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {getLanguageFlag()}
                        <span className="ms-2 langname">{getLanguageName()}</span>
                    </button>
                    <ul className="dropdown-menu">
                        {languagesary.map(x => (
                            <li key={x.id}>
                                <button 
                                    type="button"
                                    className={"dropdown-item btnlanguage" + x.prefix + activeLanguage(x.value)} 
                                    onClick={(e) => setMyLanguage(e, x)}
                                >
                                    {getLanguageFlag(x.prefix)}
                                    <span className="ms-2 langname">{x.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default LanguageSwitcher;
