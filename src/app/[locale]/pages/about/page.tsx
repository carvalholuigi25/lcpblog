/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { formatDate } from '@applocale/functions/functions';
import { getDefLocale } from '@applocale/helpers/defLocale';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';

const AboutPage = ({ params }: { params: any }) => {
    const {locale}: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.AboutPage");
    const datefrm = formatDate(new Date());

    return (
        <div className={"npage " + styles.page + " mabout"} id="mabout">
            <Header locale={vlocale} />
            <section className="aboutpage">
                <h3 className="titlep">{t("title") ?? "About"}</h3>
                <Image src="@assets/images/logo.jpg" alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="img-fluid logo" />
                <p className="textformatted">
                    {t("txtabout") ?? "LCPBlog is a blog about giving news and status of my LCP Projects to everyone."}
                </p>
                <p className="textformatted">
                    {t("txtteam") ?? "The team, <br /> LCP"}
                </p>
                <p className="textformatted">
                    {t("txtlastupdated", {date: datefrm}) ?? `Last date updated: ${datefrm}`}
                </p>
            </section>
            <Footer />
        </div>
    );
}

export default AboutPage;