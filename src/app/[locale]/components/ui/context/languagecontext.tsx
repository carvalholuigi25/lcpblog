"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as config from "@applocale/utils/config";

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const langdef = config.getConfigSync().language;
    const pathname = usePathname();    
    const [language, setLanguageState] = useState<string>(langdef);

    useEffect(() => {
        const savedLanguage = pathname.split('/')[1] || localStorage.getItem("language") || langdef;
        setLanguageState(savedLanguage);
        localStorage.setItem("language", savedLanguage);
        document.documentElement.setAttribute("lang", savedLanguage);
    }, [pathname, langdef]);

    const setLanguage = (newLanguage: string) => {
        setLanguageState(newLanguage);
        localStorage.setItem("language", newLanguage);
        document.documentElement.setAttribute("lang", newLanguage)
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
