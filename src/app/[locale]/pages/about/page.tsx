/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { formatDate, getImagePath } from '@applocale/functions/functions';
import { getDefLocale } from '@applocale/helpers/defLocale';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';
import SanitizeHTML from "@applocale/utils/sanitizehtml";

const AboutPage = ({ params }: { params: any }) => {
    const { locale }: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.AboutPage");
    const datefrm = formatDate(new Date());

    return (
        <div className={"npage " + styles.page + " mabout"} id="mabout">
            <Header locale={vlocale} />
            <section className="aboutpage">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <Image src={getImagePath("logos/logo.svg")} alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="card-img-top img-fluid logo" />
                                <div className="card-body">
                                    <h3 className="titlep card-title text-center">{t("title") ?? "About"}</h3>
                                    <p className="textformatted mt-3">
                                        {t("txtabout") ?? "LCPBlog is a blog about giving news and status of my LCP Projects to everyone."}
                                    </p>
                                    <div className="textformatted mt-3" dangerouslySetInnerHTML={{__html: SanitizeHTML(t.markup("txtteam") ?? "The team, <br /> LCP")}}></div>
                                    <p className="textformatted mt-3">
                                        {t("txtdateupdated", { date: datefrm }) ?? `Last date updated: ${datefrm}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default AboutPage;