/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/app/components/context/themecontext";

export interface ThemesModel {
    id: number;
    theme: string;
    title: string;
}

export function getMyCustomThemes() {
    const ary = [
        {
            id: 1,
            theme: "light",
            title: "Light"
        },
        {
            id: 2,
            theme: "dark",
            title: "Dark"
        },
        {
            id: 3,
            theme: "system",
            title: "System"
        },
        {
            id: 4,
            theme: "red",
            title: "Red"
        },
        {
            id: 5,
            theme: "green",
            title: "Green"
        },
        {
            id: 6,
            theme: "blue",
            title: "Blue"
        },
        {
            id: 7,
            theme: "yellow",
            title: "Yellow"
        }
    ];

    return [...new Map(ary.map(item => [item.id, item])).values()];
}

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const themesary: ThemesModel[] = getMyCustomThemes();
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
