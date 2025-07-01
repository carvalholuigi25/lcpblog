"use client";

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from '@applocale/helpers/defLocale';
import ThemeSwitcher from '@applocale/components/ui/themeswitcher';
import LanguageSwitcher from '@applocale/components/ui/languageswitcher';
import { getConfigSync } from '../utils/config';

const Footer = () => {
    const locale = useLocale() ?? getDefLocale();
    const t = useTranslations('ui.footer');
    const isRounded = getConfigSync().isBordered;
    const roundedCl = isRounded ? "roundedfooter " : " ";

    return (
        <footer className={roundedCl + "footer"}>
            <div className='container d-flex justify-content-center align-items-center'>
                <div className='row p-3 w-100'>
                    <div className="col-12 col-md-6 col-lg-6 colfooter1">
                        <h3 className='titlelinks'>{t("links.title") ?? "Useful links"}</h3>
                        <ul className='listlinks'>
                            <li>
                                <Link href={`/pages/about`} locale={locale}>
                                    {t("links.linkabout") ?? "About"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/pages/policies/privacy`} locale={locale}>
                                    {t("links.linkprivacypolicy") ?? "Privacy policy"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/pages/policies/termsofuse`} locale={locale}>
                                    {t("links.linktermsofusepolicy") ?? "Terms of Use"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/pages/policies/cookies`} locale={locale}>
                                    {t("links.linkcookiespolicy") ?? "Cookies policy"}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-12 col-md-6 col-lg-6 colfooter2'>
                        <h3 className='titlelinks'>{t("links.titlethemelang") ?? "Theme & Language"}</h3>
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
            <div className='mt-3 d-block'>
                <span>
                    {t('title')} {<Link href="mailto:luiscarvalho239@gmail.com">Luis Carvalho</Link>} {<Link href="https://lcp-pi.vercel.app/" target="_blank" rel="noopener noreferrer" className='ms-1'>LCP</Link>} &copy;{new Date().getFullYear()}
                </span>
            </div>
        </footer>
    );
};

export default Footer;