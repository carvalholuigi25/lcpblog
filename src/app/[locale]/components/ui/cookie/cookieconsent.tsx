"use client";
import { setCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import {getConfigSync} from "@applocale/utils/config";

const CookieConsent = () => {
    const t = useTranslations("ui.cookies.consent");
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        if (!hasCookie('consent')) {
            setShowConsent(true);
        }
    }, []);

    if (!showConsent) {
        return null;
    }

    const is3DEffectsEnabled = getConfigSync().is3DEffectsEnabled;
    const effects3dcl = is3DEffectsEnabled ? "cookieconsent3D" : "";
    const btn3dcl = is3DEffectsEnabled ? "btn3Dbox" : "";
    const animcl = showConsent ? "animate__fadeIn" : "animate__fadeOut";

    const acceptConsent = () => {
        setShowConsent(false);
        setCookie('consent', 'true');
    };

    const declineConsent = () => {
        setShowConsent(false);
        deleteCookie("consent");
    };

    return (
        <div className={"cookieconsent " + effects3dcl + " bordered animate__animated " + animcl}>
            <div className="colleft">
                <i className="bi bi-cookie icocookie"></i>
                <p className='msgcookie'>{t("message") ?? "We use cookies to improve your experience. By your continued use of this site you accept such use."}</p>
            </div>
            <div className="colright">
                <button className={'btn btn-primary btn-rounded btn-tp btnaccept ' + btn3dcl} onClick={acceptConsent}>
                    <i className="bi bi-check-circle icoaccept"></i>
                    <span className="txtaccept">
                        {t("btnaccept") ?? "Got it!"}
                    </span>
                </button>
                <button className={'btn btn-secondary btn-rounded btn-tp btndecline ' + btn3dcl} onClick={declineConsent}>
                    <i className="bi bi-x-circle icodecline"></i>
                    <span className="txtdecline">
                        {t("btndecline") ?? "Decline"}
                    </span>
                </button>
            </div>
        </div>
    );

}

export default CookieConsent;