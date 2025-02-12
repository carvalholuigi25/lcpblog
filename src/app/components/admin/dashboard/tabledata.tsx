import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface THeadersModel {
    dataIndex: string;
    title: string;
}

export default function TableData({ theaders, tdata }: { theaders: THeadersModel[], tdata: any }) {
    const isBorderEnabled = true;
    const isRoundedEnabled = false;

    const isBorderEnabledCl = isBorderEnabled ? "bordered" : "nobordered";
    const isRoundedEnabledCl = isRoundedEnabled ? "table-rounded" : "";
    const totaltheaders = theaders.length + 1;

    return (
        <div className="table-responsive">
            <table className={"table table-" + isBorderEnabledCl + " " + isRoundedEnabledCl}>
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
                        const values = theaders.map((thx: any) => tdataitem[thx.dataIndex]);
                        const vid = tdataitem["postId"] ?? (i+1);

                        return (
                            <tr key={"x" + i}>
                                {values.map((v: number, k: number) => (
                                    <td key={"tdx" + k}>{v}</td>
                                ))}

                                <td>
                                    <Link href={'/pages/news/edit/'+vid} className="btn btn-primary btnedit">
                                        <i className="bi bi-pencil-fill" style={{border: 0}}></i>
                                    </Link>
                                    <Link href={'/pages/news/delete/'+vid} className="btn btn-primary btndel">
                                        <i className="bi bi-trash3-fill" style={{border: 0}}></i>
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={totaltheaders ?? 1}>
                            Total posts: {tdata.length}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}