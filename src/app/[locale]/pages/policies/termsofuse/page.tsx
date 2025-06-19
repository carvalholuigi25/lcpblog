/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { formatDate, getImagePath } from '@applocale/functions/functions';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';

const TermsOfUsePage = ({ params }: { params: any }) => {
    const { locale }: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.TermsOfUsePolicyPage");
    const datefrm = formatDate(new Date());

    const getText = (date: any, websitename: string, email: string, owner: string) => {
        return (
            <>
                <p>Last Updated: {date}</p><p>Welcome to {websitename} (we, us or our). These Terms of Use govern your access to and use of our blog, available at {websitename}.</p><p>By accessing or using the Site, you agree to comply with and be bound by these Terms. If you do not agree, please do not use the Site.</p><ol start={1} type='1'><li>Use of Content</li></ol><p>All content on this blog, including articles, images, videos, and other materials, is for informational and/or entertainment purposes only.</p><ul><li>You may share, quote, or reference the Content, but must provide proper credit and link back to the original post.</li><li>You may not copy, reproduce, or distribute full articles without our prior written permission.</li><li>You may not use the Content for any commercial purposes without authorization.</li></ul><ol start={2} type='1'><li>User Conduct</li></ol><p>By using the Site, you agree not to:</p><ul><li>Post or transmit any unlawful, harmful, defamatory, or obscene material.</li><li>Impersonate any person or entity.</li><li>Attempt to gain unauthorized access to any part of the Site.</li><li>Use the Site to spread spam or malicious software.</li></ul><p>We reserve the right to remove any content or block users who violate these rules.</p><ol start={3} type='1'><li>Comments and User Content</li></ol><p>We welcome comments and engagement on our blog. However:</p><ul><li>You are solely responsible for the content you post.</li><li>We reserve the right to moderate, edit, or delete comments at our discretion.</li><li>By posting, you grant us a non-exclusive, royalty-free license to display and use your content on the Site.</li></ul><ol start={4} type='1'><li>Intellectual Property</li></ol><p>All original content on this Site is protected by copyright and other intellectual property laws. The blogs name, logo, and design are owned by {owner}.</p><ol start={5} type='1'><li>Third-Party Links</li></ol><p>The Site may contain links to third-party websites (or not). These are provided for your convenience and do not imply endorsement. We are not responsible for the content or practices of linked sites.</p><ol start={6} type='1'><li>Disclaimer</li></ol><p>The information provided on this blog is provided as is and for general informational purposes only. We make no warranties regarding the accuracy or completeness of any content.</p><ol start={7} type='1'><li>Limitation of Liability</li></ol><p>To the fullest extent permitted by law, we are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site.</p><ol start={8} type='1'><li>Modifications to Terms</li></ol><p>We may update these Terms from time to time. Any changes will be posted on this page with the updated date. Your continued use of the Site constitutes acceptance of those changes.</p><ol start={9} type='1'><li>Contact</li></ol><p>For questions about these Terms, please contact us at {email}.</p>
            </>
        )
    }

    return (
        <div className={"npage " + styles.page + " mtermsofuse"} id="mtermsofuse">
            <Header locale={vlocale} />
            <section className="termsofusepage">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <Image src={getImagePath("logos/logo.svg")} alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="card-img-top img-fluid logo" />
                                <div className="card-body">
                                    <h3 className="titlep">{t("title") ?? "Terms of Use"}</h3>
                                    <div className='txtterms'>
                                        {getText(datefrm, "LCPBlog", "luiscarvalho239@gmail.com", "Luis Carvalho")}
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

export default TermsOfUsePage;