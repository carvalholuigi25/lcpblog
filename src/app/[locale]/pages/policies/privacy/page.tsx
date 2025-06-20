/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { formatDate, getImagePath } from '@applocale/functions/functions';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';

const PrivacyPolicyPage = ({ params }: { params: any }) => {
    const { locale }: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.PrivacyPolicyPage");
    const datefrm = formatDate(new Date());

    const getText = (date: any, website: string, email: string) => {
        return (
            <>
           <p>Effective Date: {date}</p><p>At LCPBlog (we, us, or ours), your privacy is very important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the Site).</p><p>Please read this privacy policy carefully. If you do not agree with the terms of this policy, please do not access the site.</p><ol start={1} type='1' className="mt-3"><li>Information We Collect</li></ol><p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p><ol start={1} type='a'><li>Personal Data</li></ol><p>Personally identifiable information, such as your name, email address, and any other information you voluntarily give to us when you subscribe to our newsletter, leave a comment, or contact us directly. </p><ol start={2} type='a'><li>Non-Personal Data</li></ol><p>Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</p><ol start={3} type='a'><li>Cookies and Tracking Technologies</li></ol><p>We may use cookies, web beacons, tracking pixels, and other tracking technologies to help customize the Site and improve your experience.</p><ol start={2} type='1'><li>How We Use Your Information</li></ol><p>We may use information collected about you via the Site to:</p><ul><li>Operate and maintain the Site</li><li>Improve your user experience</li><li>Respond to comments and inquiries</li><li>Send newsletters or email updates</li><li>Monitor and analyze usage and trends</li><li>Protect against malicious or fraudulent activity</li></ul><p>Comply with legal obligations</p><ol start={3} type='1'><li>Sharing Your Information</li></ol><p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners or trusted affiliates.</p><p>We may also share information if required by law or to protect our rights.</p><ol start={4} type='1'><li>Third-Party Services</li></ol><p>We may use third-party services such as:</p><ul><li>Google Analytics to monitor website traffic</li><li>Mailchimp / ConvertKit / etc. to manage email subscriptions</li><li>Ad networks (if applicable) to display advertisements</li><li>These third parties have their own privacy policies, and we encourage you to review them.</li></ul><ol start={5} type='1'><li>Your Rights and Choices</li></ol><p>Depending on your location, you may have the following rights regarding your personal data:</p><ul><li>Access to the data we hold about you</li><li>Correction or deletion of your data</li><li>Withdrawal of consent for data use</li><li>Filing a complaint with a data protection authority</li></ul><p>To exercise any of these rights, please contact us at {email}.</p><ol start={6} type='1'><li>Data Security</li></ol><p>We take appropriate security measures to protect your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.</p><ol start={7} type='1'><li>Childrens Privacy</li></ol><p>Our Site is not intended for children under the age of 13, and we do not knowingly collect personal information from children.</p><ol start={8} type='1'><li>Changes to This Privacy Policy</li></ol><p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p><ol start={9} type='1'><li>Contact Us</li></ol><p>If you have any questions about this Privacy Policy, you can contact us at:</p><p>LCPBlog</p><p>Email: {email}</p><p>Website: {website}</p>
            </>
        )
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