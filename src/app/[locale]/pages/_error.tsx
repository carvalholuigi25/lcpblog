import Link from "next/link"
import {useTranslations} from 'next-intl';

function Error({ statusCode }: { statusCode: number }) {
    const t = useTranslations('pages.Error');

    return (
        <div className="container p-3 d-flex justify-content-center align-items-center text-center mhv-100">
            <div className="row">
                <div className="col-12">
                    <div className="card mx-auto">
                        <div className="card-body text-center">
                            <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem" }} />
                            <h3>{t('title') ?? 'Error'}</h3>
                            <p>
                                {statusCode
                                ? t('msgerror') ?? `An error ${statusCode} occurred on server`
                                : t('msgerror2') ?? 'An error occurred on client'}
                            </p>
                            <Link href={'/'} className="btn btn-primary btn-rounded btnback mt-3">
                                {t('btnback') ?? 'Back'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Error.getInitialProps = ({ res, err }: { res: any, err: any }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
   
  export default Error