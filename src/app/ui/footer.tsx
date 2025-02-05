import Link from 'next/link';
import React from 'react';
import styles from "@/app/page.module.scss";
import ThemeSwitcher from '@/app/components/themeswitcher';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <ThemeSwitcher />
            <span>
                Created by {<Link href="mailto:luiscarvalho239@gmail.com">Luis Carvalho</Link>} @{new Date().getFullYear()}
                <Link href="https://lcp-pi.vercel.app/" target="_blank" rel="noopener noreferrer" className='ms-1'>
                    LCP
                </Link>
            </span>
        </footer>
    );
};

export default Footer;