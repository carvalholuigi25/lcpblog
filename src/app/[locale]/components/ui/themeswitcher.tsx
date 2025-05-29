/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "@applocale/components/ui/context/themecontext";
import * as config from "@applocale/utils/config";

export interface ThemesModel {
    id: number;
    title: string;
    theme: string;
}

export function GetMyCustomThemes(): any {
    const t = useTranslations("ui.footer.themes.options");

    const ary = [
        {
            id: 1,
            title: t("light.name") ?? "Light",
            theme: t("light.value") ?? "light",
        },
        {
            id: 2,
            title: t("dark.name") ?? "Dark",
            theme: t("dark.value") ?? "dark"
        },
        {
            id: 3,
            title: t("system.name") ?? "System",
            theme: t("system.value") ?? "system"
        },
        {
            id: 4,
            title: t("red.name") ?? "Red",
            theme: t("red.value") ?? "red"
        },
        {
            id: 5,
            title: t("green.name") ?? "Green",
            theme: t("green.value") ?? "green"
        },
        {
            id: 6,
            title: t("blue.name") ?? "Blue",
            theme: t("blue.value") ?? "blue"
        },
        {
            id: 7,
            title: t("yellow.name") ?? "Yellow",
            theme: t("yellow.value") ?? "yellow"
        },
        {
            id: 8,
            title: t("vanilla.name") ?? "Vanilla",
            theme: t("vanilla.value") ?? "vanilla"
        }
    ];

    return [...new Map(ary.map(item => [item.id, item])).values()];
}

const ThemeSwitcher = () => {
    const setMyTheme = (e: any, x: ThemesModel): any => {
        e.preventDefault();
        setTheme(x.theme);
        setThemeName(x.title);
    }

    const activeTheme = (x: string) => {
        return x == theme ? " active" : "";
    }

    const GetDefaultTheme = () => {
        return ["pt", "pt-PT", "pt-BR"].includes(useLocale()) ? "Sistema" : "System";
    }

    const { theme, setTheme } = useTheme();
    const themesary: ThemesModel[] = GetMyCustomThemes();
    const [themeName, setThemeName] = useState<string>(GetDefaultTheme() ?? "");
    const is3DEffectsEnabled = config.getConfigSync().is3DEffectsEnabled;

    useEffect(() => {
        setThemeName(themesary.filter(x => x.theme == theme)[0].title);
    }, [theme, themesary]);

    return (
        <>
            {!!themesary && (
                <div className="dropdown mt-3 mb-3">
                    <button
                        type="button"
                        className={"btn btn-secondary dropdown-toggle btn-rounded " + (is3DEffectsEnabled ? "btn-3D-box" : "")}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {themeName}
                    </button>
                    <ul className="dropdown-menu">
                        {themesary.map(x => (
                            <li key={x.id}>
                                <button 
                                    type="button"
                                    className={"dropdown-item btntheme" + x.theme + activeTheme(x.theme)} 
                                    onClick={(e) => setMyTheme(e, x)}
                                >
                                    {x.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default ThemeSwitcher;
