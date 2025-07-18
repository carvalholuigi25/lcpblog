import styles from "@applocale/page.module.scss";
import { useTranslations } from "next-intl";
import { Link } from '@/app/i18n/navigation';
import { getDefLocale } from '@applocale/helpers/defLocale';
import { formatDate } from '@applocale/functions/functions';

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
    linkSuffix?: string;
    tblDataCl?: string;
}

export default function TableData({ theaders, tdata, namep, locale, currentPage, totalPages, linkSuffix, tblDataCl }: TableDataProps) {
    const t = useTranslations('ui.tables.'+(tblDataCl ?? "tabledata"));
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
            {!tdata || tdata.length == 0 && (
                <div className='col-12 card p-3 text-center'>
                    <div className='card-body'>
                        <i className="bi bi-database-exclamation" style={{ fontSize: "4rem" }}></i>
                        <p>{t('body.emptydata') ?? "No data, please create a new one..."}</p>
                    </div>
                </div>
            )}

            <div className={"table-responsive " + "mtable-" + isBorderEnabledCl + " " + isShadowEnabledCl + " " + isLongContentEnabledCl}>
                {!!tdata && tdata.length > 0 && (
                    <table className={"table table-" + isBorderEnabledCl + " " + isRoundedEnabledCl + " table-autolayout"}>
                        <thead>
                            <tr>
                                {theaders.map((theader: any, i: number) => (
                                    <th key={"thv" + i}>{theader.title}</th>
                                ))}

                                <th>{t('header.actions') ?? "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tdata.map((tdataitem: any, i: number) => {
                                const values = theaders.map((thx: any) => {
                                    return !!["createdAt", "updatedAt"].includes(thx.dataIndex) ? formatDate(tdataitem[thx.dataIndex]) : tdataitem[thx.dataIndex]; 
                                });
                                const vid = tdataitem["postId"] ?? (i + 1);
                                const linksuffix = (!!linkSuffix ? (linkSuffix.endsWith("/") ? linkSuffix : linkSuffix + "/") : ""+namep.toLowerCase()).replace(/(\/)$/g, "");
                                const linkedit = `/pages/${linksuffix}/edit/${vid}`;
                                const linkdel = `/pages/${linksuffix}/delete/${vid}`;	

                                return (
                                    <tr key={"x" + i}>
                                        {values.map((v: number, k: number) => (
                                            <td key={"tdx" + k}><span title={""+v}>{v}</span></td>
                                        ))}

                                        <td>
                                            <Link href={linkedit} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btnedit" title={t('body.btnedit') ?? "Edit"}>
                                                <i className="bi bi-pencil-fill" style={{ border: 0 }}></i>
                                            </Link>
                                            <Link href={linkdel} locale={locale ?? getDefLocale()} className="btn btn-primary btn-rounded btndel ms-2" title={t('body.btndelete') ?? "Delete"}>
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
                                        <span>{t('footer.page') ?? "Page"}: {currentPage}/{totalPages}</span>
                                    )}
                                    
                                    <span className="ms-2">{t('footer.totalData') ?? "Total of"} {namep.toLowerCase()}: {tdata.length}</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
}