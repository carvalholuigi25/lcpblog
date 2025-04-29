/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "@applocale/components/context/themecontext";

export interface ThemesModel {
    id: number;
    theme: string;
    title: string;
}

export function GetMyCustomThemes(): any {
    const t = useTranslations("ui.footer.themes.options");

    const ary = [
        {
            id: 1,
            theme: t("light.value") ?? "light",
            title: t("light.name") ?? "Light"
        },
        {
            id: 2,
            theme: t("dark.value") ?? "dark",
            title: t("dark.name") ?? "Dark"
        },
        {
            id: 3,
            theme: t("system.value") ?? "system",
            title: t("system.name") ?? "System"
        },
        {
            id: 4,
            theme: t("red.value") ?? "red",
            title: t("red.name") ?? "Red"
        },
        {
            id: 5,
            theme: t("green.value") ?? "green",
            title: t("green.name") ?? "Green"
        },
        {
            id: 6,
            theme: t("blue.value") ?? "blue",
            title: t("blue.name") ?? "Blue"
        },
        {
            id: 7,
            theme: t("yellow.value") ?? "yellow",
            title: t("yellow.name") ?? "Yellow"
        },
        {
            id: 8,
            theme: t("vanilla.value") ?? "vanilla",
            title: t("vanilla.name") ?? "Vanilla"
        }
    ];

    return [...new Map(ary.map(item => [item.id, item])).values()];
}

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const themesary: ThemesModel[] = GetMyCustomThemes();
    const UpperCase = (val: string) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
    }

    const setMyTheme = (e: any, x: string): any => {
        e.preventDefault();
        setTheme(x);
    }

    const activeTheme = (x: string) => {
        return x == theme ? " active" : "";
    }

    return (
        <>
            {!!themesary && (
                <div className="dropdown mt-3 mb-3">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {UpperCase(theme)}
                    </button>
                    <ul className="dropdown-menu">
                        {themesary.map(x => (
                            <li key={x.id}>
                                <button 
                                    className={"dropdown-item btntheme" + x.theme + activeTheme(x.theme)} 
                                    onClick={(e) => setMyTheme(e, x.theme)}
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
