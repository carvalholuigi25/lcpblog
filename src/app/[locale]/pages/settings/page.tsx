"use client";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { allUsers } from "@applocale/functions/functions";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import withAuth from "@applocale/utils/withAuth";
import LoadingComp from "@applocale/components/ui/loadingcomp";
import SettingsComp from "@applocale/components/ui/settings";

const UsersSettings = () => {
    const locale = useLocale() ?? getDefLocale();
    const t = useTranslations("pages.SettingsPage");
    const tbtn = useTranslations("ui.buttons");
    const [logInfo, setLogInfo] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!logInfo) {
            setLogInfo(getFromStorage("logInfo")!);
        }

        setIsAuthorized(logInfo && allUsers.includes(JSON.parse(logInfo)[0].role) ? true : false);
        setLoading(false);
    }, [logInfo, isAuthorized]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
        );
    }

    return (
        <div className={"npage userssettingspage"} id="userssettingspage">            
            <div className="container">
                <div className="row p-3">
                    <Header locale={locale} />

                    {!!isAuthorized && (
                        <>
                            <div className={"col-12 col-md-12 col-lg-12"}>
                                <h3 className="text-center titlep">
                                    <i className="bi bi-gear-fill me-2"></i>
                                    {t("title") ?? "Settings"}
                                </h3>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                           <SettingsComp />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mt-3 mx-auto text-center">
                                    <Link href={'/'} className="btn btn-primary btn-rounded" locale={locale ?? getDefLocale()}>
                                        {tbtn('btnback') ?? "Back"}
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default withAuth(UsersSettings, allUsers);