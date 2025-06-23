/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { formatDate, getImagePath } from '@applocale/functions/functions';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';
import RichText from "@/app/[locale]/components/ui/richtext";

const PrivacyPolicyPage = ({ params }: { params: any }) => {
    const { locale }: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.PrivacyPolicyPage");
    const tp = useTranslations("policies.privacy");
    const datefrm = formatDate(new Date());

    const getText = (date: any, website: string, email: string) => {
        return <RichText>{(tags) => tp.rich("txtpprivacy", {...tags, date, website, email})}</RichText>;
    }

    return (
        <div className={"npage " + styles.page + " mprivacypolicy"} id="mprivacypolicy">
            <Header locale={vlocale} />
            <section className="privacypolicypage">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <Image src={getImagePath("logos/logo.svg")} alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="card-img-top img-fluid logo" />
                                <div className="card-body">
                                    <h3 className="titlep">{t("title") ?? "Privacy Policy"}</h3>
                                    <div className='txtprivacy'>
                                        {getText(datefrm, "http://localhost:3000", "luiscarvalho239@gmail.com")}
                                    </div>
                                    <p className='txtdateupdated'>
                                        {t("txtdateupdated", {date: datefrm}) ?? `Last date updated: ${datefrm}`}
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

export default PrivacyPolicyPage;