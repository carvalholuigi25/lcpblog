import styles from "@applocale/page.module.scss";
import { getDefLocale } from '@applocale/helpers/defLocale';
import { Link } from '@/app/i18n/navigation';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface THeadersModel {
    dataIndex: string;
    title: string;
}

export interface TableDataProps {
    theaders: THeadersModel[];
    tdata: any;
    namep: string;
    locale: string;
    currentPage?: number;
    totalPages?: number;
}

export function formatDate(mydate: number | string | Date) {
    return new Date(mydate).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' });
}

export default function TableData({ theaders, tdata, namep, locale, currentPage, totalPages }: TableDataProps) {
    const isBorderEnabled = false;
    const isRoundedEnabled = true;
    const isShadowEnabled = true;
    const isLongContentEnabled = true;
    const isBorderEnabledCl = isBorderEnabled ? "bordered" : "nobordered";
    const isRoundedEnabledCl = isRoundedEnabled ? "table-rounded" : "";
    const isShadowEnabledCl = isShadowEnabled ? "mtable-shadow" : "";
    const isLongContentEnabledCl = isLongContentEnabled ? "mtable-long" : "";
    const totaltheaders = theaders.length + 1;

    return (
        <div className={styles.myroundedscrollbar}>
            <div className={"table-responsive " + "mtable-" + isBorderEnabledCl + " " + isShadowEnabledCl + " " + isLongContentEnabledCl}>
                {!tdata || tdata.length == 0 && (
                    <div className='container'>
                        <div className='row justify-content-center align-items-center p-3'>
                            <div className='col-12 card p-3 text-center'>
                                <div className='card-body'>
                                    <i className="bi bi-file-earmark-post-fill" style={{ fontSize: "4rem" }}></i>
                                    <p>No posts, please create a new one...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!!tdata && tdata.length > 0 && (
                    <table className={"table table-" + isBorderEnabledCl + " " + isRoundedEnabledCl + " table-autolayout"}>
                        <thead>
                            <tr>
                                {theaders.map((theader: any, i: number) => (
                                    <th key={"thv" + i}>{theader.title}</th>
                                ))}

                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tdata.map((tdataitem: any, i: number) => {
                                const values = theaders.map((thx: any) => {
                                    return !!["createdAt", "updatedAt"].includes(thx.dataIndex) ? formatDate(tdataitem[thx.dataIndex]) : tdataitem[thx.dataIndex]; 
                                });
                                const vid = tdataitem["postId"] ?? (i + 1);

                                return (
                                    <tr key={"x" + i}>
                                        {values.map((v: number, k: number) => (
                                            <td key={"tdx" + k}><span title={""+v}>{v}</span></td>
                                        ))}

                                        <td>
                                            <Link href={'/pages/' + namep.toLowerCase() + '/edit/' + vid} locale={locale ?? getDefLocale()} className="btn btn-primary btnedit">
                                                <i className="bi bi-pencil-fill" style={{ border: 0 }}></i>
                                            </Link>
                                            <Link href={'/pages/' + namep.toLowerCase() + '/delete/' + vid} locale={locale ?? getDefLocale()} className="btn btn-primary btndel ms-2">
                                                <i className="bi bi-trash3-fill" style={{ border: 0 }}></i>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={totaltheaders ?? 1}>
                                    {currentPage! > 0 && totalPages! > 0 && (
                                        <span>Page: {currentPage}/{totalPages}</span>
                                    )}
                                    
                                    <span className="ms-2">Total {namep.toLowerCase()}: {tdata.length}</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
}