/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { formatDate, getImagePath } from '@applocale/functions/functions';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';

const CookiesPolicyPage = ({ params }: { params: any }) => {
    const { locale }: any = use(params);
    const vlocale = locale ?? getDefLocale();
    const t = useTranslations("pages.CookiesPolicyPage");
    const datefrm = formatDate(new Date());

    const getText = (date: any, website: string, websitename: string, email: string) => {
        return (
            <>
            <p>Last updated: {date}</p><p>This Cookies Policy explains how [{websitename}] (we, us, or our) uses cookies and similar technologies to recognize you when you visit our website at {website} {websitename}. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p><ol start={1} type='1'><li>What Are Cookies?</li></ol><p>Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used to make websites work, or work more efficiently, as well as to provide reporting information.</p><p>Cookies set by the website owner (in this case, {websitename}) are called first-party cookies. Cookies set by parties other than the website owner are called third-party cookies. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., analytics, advertising, and social media).</p><ol start={2} type='1'><li>Why Do We Use Cookies?</li></ol><p>We use first-party and third-party cookies for several reasons:</p><ul><li>Essential Cookies: These are necessary for the website to function and cannot be switched off in our systems.</li><li>Performance and Analytics Cookies: These help us understand how visitors interact with the site by collecting and reporting information anonymously (e.g. Google Analytics).</li><li>Functionality Cookies: These allow the website to remember choices you make and provide enhanced, more personal features.</li><li>Advertising Cookies (if applicable): These may be used by advertising partners to build a profile of your interests and show you relevant ads on other sites.</li></ul><ol start={3} type='1'><li>What Cookies Do We Use?</li></ol><p>Examples include but are not limited to:</p><div className='table-responsive mt-3 mb-3'><table className='table'><thead><tr><th>Cookie Name</th><th>Purpose</th><th>Type</th><th>Duration</th></tr></thead><tbody><tr><td>_ga</td><td>Google Analytics (tracks visitor behavior)</td><td>Third-party</td><td>2 years</td></tr><tr><td>consent</td><td>Remembers user cookie preferences</td><td>First-party</td><td>6 months</td></tr></tbody></table></div><ol start={4} type='1'><li>How Can You Control Cookies?</li></ol><p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences through:</p><ul><li>The cookie banner or pop-up when you first visit our site.</li><li>Adjusting your browser settings to block or delete cookies.</li><li>Using opt-out tools provided by third parties (e.g., Google Opt-Out Tool).</li></ul><p>Please note that disabling cookies may impact the functionality of our website.</p><ol start={5} type='1'><li>Updates to This Policy</li></ol><p>We may update this Cookies Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed.</p><ol start={6} type='1'><li>Contact Us</li></ol><p>If you have any questions about our use of cookies or this policy, please contact us at:</p><p>Email: {email}</p><p>Website: {website}</p>
            </>
        )
    }

    return (
        <div className={"npage " + styles.page + " mcookiespolicy"} id="mcookiespolicy">
            <Header locale={vlocale} />
            <section className="cookiespolicypage">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <Image src={getImagePath("logos/logo.svg")} alt={t("txtlogo") ?? "LCPBlog's logo"} width={200} height={200} className="card-img-top img-fluid logo" />
                                <div className="card-body">
                                    <h3 className="titlep">{t("title") ?? "Cookies Policy"}</h3>
                                    <div className='txtcookies'>
                                        {getText(datefrm, "http://localhost:3000", "LCPBlog", "luiscarvalho239@gmail.com")}
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

export default CookiesPolicyPage;