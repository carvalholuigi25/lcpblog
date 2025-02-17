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
    }, []);
    
    return (
        <></>
    )
}