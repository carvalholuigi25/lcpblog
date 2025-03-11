/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LanguagesLocales, localesary } from "@/app/i18n/locales";
import { useLanguage } from "@/app/components/context/languagecontext";
import { useRouter } from "next/navigation";

export function getMyCustomLanguages() {
    const ary = localesary;

    return [...new Map(ary.map(item => [item.id, item])).values()];
}

const LanguageSwitcher = () => {
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const languagesary: LanguagesLocales[] = getMyCustomLanguages();

    const setMyLanguage = (e: any, x: LanguagesLocales): any => {
        e.preventDefault();
        setLanguage(x.value);
        router.push('/' + x.value);
    }

    const activeLanguage = (x: string) => {
        return x == language ? " active" : "";
    }

    return (
        <>
            {!!languagesary && (
                <div className="dropdown mt-3 mb-3">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {languagesary.filter(x => x.value == language).map(x => x.name)}
                    </button>
                    <ul className="dropdown-menu">
                        {languagesary.map(x => (
                            <li key={x.id}>
                                <button 
                                    className={"dropdown-item btnlanguage" + x.value + activeLanguage(x.value)} 
                                    onClick={(e) => setMyLanguage(e, x)}
                                >
                                    {x.name}
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
