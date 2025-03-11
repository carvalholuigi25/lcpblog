"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<string>("en");

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        setLanguageState(savedLanguage);
        document.documentElement.setAttribute("lang", savedLanguage);
        document.documentElement.setAttribute("dir", savedLanguage === 'ar' ? 'rtl' : 'ltr');
    }, []);

    const setLanguage = (newLanguage: string) => {
        setLanguageState(newLanguage);
        localStorage.setItem("language", newLanguage);
        document.documentElement.setAttribute("lang", newLanguage)
        document.documentElement.setAttribute("dir", newLanguage === 'ar' ? 'rtl' : 'ltr');
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
