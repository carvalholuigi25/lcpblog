"use client";
import { Link } from '@/app/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type Props = {
    error: Error;
    reset(): void;
};

export default function Error({error}: Props) {
    const t = useTranslations('pages.404');

    useEffect(() => {
        console.error(error);
    }, [error]);
    
    return (
        <div className="container p-3 d-flex justify-content-center align-items-center text-center mhv-100">
            <div className="row">
                <div className="col-12">
                    <div className="card mx-auto">
                        <div className="card-body text-center">
                            <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem" }} />
                            <h3>{t('title') ?? 'Error 404 - Page not found'}</h3>
                            <p>{t('msgerror') ?? 'This page does not exist!'}</p>
                            <Link href={'/'} className="btn btn-primary btn-rounded btnback mt-3">
                                {t('btnback') ?? 'Back'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}