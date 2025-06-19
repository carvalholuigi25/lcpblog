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

const PrivacyPolicyPage = ({ params }: { params: any }) => {
    const {locale}: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.PrivacyPolicyPage");
    const policyt = useTranslations("policies.privacy.text");
    const datefrm = formatDate(new Date());

    return (
        <div className={"npage " + styles.page + " mprivacypolicy"} id="mprivacypolicy">
            <Header locale={vlocale} />
            <section className="privacypolicypage">
                <h3 className="titlep">{t("title") ?? "Privacy Policy"}</h3>
                <Image src="@assets/images/logo.jpg" alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="img-fluid logo" />
                <div className='txtprivacy' dangerouslySetInnerHTML={{ __html: SanitizeHTML(policyt("text")) }}></div>
                <p className='txtdateupdated'>
                    {t("txtdateupdated") ?? `Last date updated: ${datefrm}`}
                </p>
            </section>
            <Footer />
        </div>
    );
}

export default PrivacyPolicyPage;