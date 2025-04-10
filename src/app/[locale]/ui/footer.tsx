import React from 'react';
import styles from "@applocale/page.module.scss";
import { useTranslations } from 'next-intl';
import {Link} from '@/app/i18n/navigation';
import ThemeSwitcher from '@applocale/components/themeswitcher';
import LanguageSwitcher from '@applocale/components/languageswitcher';

const Footer: React.FC = () => {
    const t = useTranslations('ui.footer');
    
    return (
        <footer className={styles.footer}>
            <div className='container d-flex justify-content-center align-items-center'>
                <div className='row'>
                    <div className='col-12 col-md-6'>
                        <ThemeSwitcher />
                    </div>
                    <div className='col-12 col-md-6'>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
            <span>
                {t('title')} {<Link href="mailto:luiscarvalho239@gmail.com">Luis Carvalho</Link>} @{new Date().getFullYear()}
                <Link href="https://lcp-pi.vercel.app/" target="_blank" rel="noopener noreferrer" className='ms-1'>
                    LCP
                </Link>
            </span>
        </footer>
    );
};

export default Footer;