"use client";
import { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'ldrs/react/Ring.css';
import 'ldrs/react/Tailspin.css';
import 'ldrs/react/DotPulse.css';

export default function Frameworks()
{
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
        import("@fortawesome/fontawesome-free/js/all.min.js");
        import("@applocale/scripts/scripts.js");        
    }, []);
    
    return (
        <></>
    )
}