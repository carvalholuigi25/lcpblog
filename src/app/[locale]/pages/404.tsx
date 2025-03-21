import { Link } from '@/app/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function Custom404() {
    const t = useTranslations('404');
    
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