"use client";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-quill-new/dist/quill.snow.css';

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