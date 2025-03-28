import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface PaginationProps {
    cid: number; 
    pid: number; 
    currentPage: number; 
    totalPages: number;
}

export default function MyPagination({cid, pid, currentPage, totalPages }: PaginationProps) {
    const isHiddenNavPagBtns = true;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(currentPage ?? 1);
    
    const createQueryVal = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
        
            return params.toString()
        },
        [searchParams]
    );

    const navToPage = (indval: number) => {
        router.push(pathname + "?" + createQueryVal("page", "" + indval));
    };

    const firstPage = () => {
        const indval = (page - page) + 1;
        setPage(indval);
        navToPage(indval);
    };

    const previousPage = () => {
        const indval = page > 1 ? page - 1 : 1;
        setPage(indval);
        navToPage(indval);
    };

    const itemPage = (index: number) => {
        const indval = index + 1;
        setPage(indval);
        navToPage(indval);
    };

    const nextPage = () => {
        const indval = page < totalPages ? page + 1 : totalPages;
        setPage(indval);
        navToPage(indval);
    };

    const lastPage = () => {
        const indval = totalPages;
        setPage(indval);
        navToPage(indval);
    };

    const getDisabled = (i: number = 1) => {
        return page === i ? "disabled" + (isHiddenNavPagBtns ? " hidden" : "") : "";
    }

    const getActive = (i: number = 1) => {
        return page === i + 1 ? "active" : "";
    }

    return (
        cid >= -1 && pid == -1 && (
            <nav className="d-flex mx-auto text-center">
                <ul className="pagination mt-3 mx-auto">
                    <li className={`page-item ${getDisabled(1)}`}>
                        <button type="button" className="page-link" onClick={() => firstPage()}>
                            <i className="bi bi-chevron-double-left"></i>
                        </button>
                    </li>
                    <li className={`page-item ${getDisabled(1)}`}>
                        <button type="button" className="page-link" onClick={() => previousPage()}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                    </li>

                    {totalPages > 0 && [...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${getActive(index)}`}>
                            <button type="button" className="page-link" onClick={() => itemPage(index)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${getDisabled(totalPages)}`}>
                        <button type="button" className="page-link" onClick={() => nextPage()}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </li>
                    <li className={`page-item ${getDisabled(totalPages)}`}>
                        <button type="button" className="page-link" onClick={() => lastPage()}>
                            <i className="bi bi-chevron-double-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        )
    );
}