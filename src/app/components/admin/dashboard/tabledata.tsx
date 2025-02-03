/* eslint-disable @typescript-eslint/no-explicit-any */
export interface THeadersModel {
    dataIndex: string;
    title: string;
}

export default function TableData({ theaders, tdata }: { theaders: THeadersModel[], tdata: any }) {
    return (
        <div className="table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {theaders.map((theader: any, i: number) => (
                            <th key={"thv" + i}>{theader.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tdata.map((tdataitem: any, i: number) => {
                        const values = theaders.map((thx: any) => tdataitem[thx.dataIndex]);

                        return (
                            <tr key={"x" + i}>
                                {values.map((v: number, k: number) => (
                                    <td key={"tdx" + k}>{v}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={theaders.length ?? 1}>
                            Total posts: {tdata.length}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}