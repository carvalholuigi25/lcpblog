/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { formatDate } from '@applocale/functions/functions';
import SanitizeHTML from "@applocale/utils/sanitizehtml";
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';

const CookiesPolicyPage = ({ params }: { params: any }) => {
    const {locale}: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.CookiesPolicyPage");
    const policyt = useTranslations("policies.termsofuse.text");
    const datefrm = formatDate(new Date());

    return (
        <div className={"npage " + styles.page + " mcookiespolicy"} id="mcookiespolicy">
            <Header locale={vlocale} />
            <section className="cookiespolicypage">
                <h3 className="titlep">{t("title") ?? "Cookies Policy"}</h3>
                <Image src="@assets/images/logo.jpg" alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="img-fluid logo" />
                <div className='txtcookies' dangerouslySetInnerHTML={{ __html: SanitizeHTML(policyt("text")) }}></div>
                <p className='txtdateupdated'>
                    {t("txtdateupdated") ?? `Last date updated: ${datefrm}`}
                </p>
            </section>
            <Footer />
        </div>
    );
}

export default CookiesPolicyPage;