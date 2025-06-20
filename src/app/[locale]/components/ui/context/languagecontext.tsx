"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getFromStorage, saveToStorage } from "@/app/[locale]/hooks/localstorage";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const langdef = getDefLocale();
    const pathname = usePathname();    
    const [language, setLanguageState] = useState<string>(langdef);

    useEffect(() => {
        const savedLanguage = pathname.split('/')[1] || getFromStorage("language") || langdef;
        setLanguageState(savedLanguage);
        saveToStorage("language", savedLanguage);
        document.documentElement.setAttribute("lang", savedLanguage);
    }, [pathname, langdef]);

    const setLanguage = async (newLanguage: string) => {
        setLanguageState(newLanguage);
        saveToStorage("language", newLanguage);
        document.documentElement.setAttribute("lang", newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
