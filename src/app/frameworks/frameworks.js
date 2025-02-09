"use client";
import { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Frameworks()
{
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
        import("@fortawesome/fontawesome-free/js/all.min.js");
        import("@/app/scripts/scripts.js");

        function setMySystemTheme() {
            const htmlth = document.querySelector('html');
            if(htmlth && htmlth.getAttribute("data-bs-theme") == "system") {
                const hours = new Date().getHours();
                htmlth.setAttribute("data-bs-theme", (hours >= 13 ? "dark" : "light"));
            }
        }

        clearInterval();
        setInterval(() => {
            setMySystemTheme();
        }, 1000);
    }, []);
    
    return (
        <></>
    )
}