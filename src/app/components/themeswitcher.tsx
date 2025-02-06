"use client";

import { useTheme } from "@/app/components/context/themecontext";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="dropdown mt-3 mb-3">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => setTheme("light")}>Light</button></li>
                <li><button className="dropdown-item" onClick={() => setTheme("dark")}>Dark</button></li>
                <li><button className="dropdown-item" onClick={() => setTheme("system")}>System</button></li>
            </ul>
        </div>
    );
};

export default ThemeSwitcher;
