import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Custom500() {
    const t = useTranslations('pages.500');
    
    return (
        <div className="container p-3 d-flex justify-content-center align-items-center text-center mhv-100">
            <div className="row">
                <div className="col-12">
                    <div className="card mx-auto">
                        <div className="card-body text-center">
                            <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem" }} />
                            <h3>{t('title') ?? 'Error 500 - Internal server error'}</h3>
                            <p>{t('msgerror') ?? 'The server encountered an error and could not complete your request.'}</p>
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