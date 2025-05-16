import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/app/i18n/navigation';
import ThemeSwitcher from '@applocale/components/themeswitcher';
import LanguageSwitcher from '@applocale/components/languageswitcher';

const Footer: React.FC = () => {
    const t = useTranslations('ui.footer');
    const isRounded = true;
    const roundedCl = isRounded ? "roundedfooter " : " ";

    return (
        <footer className={roundedCl + "footer"}>
            <div className='container d-flex justify-content-center align-items-center'>
                <div className='row'>
                    <div className='col-12 col-md-6 col-lg-auto colfooter1'>
                        <ThemeSwitcher />
                    </div>
                    <div className='col-12 col-md-6 col-lg-auto colfooter2'>
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